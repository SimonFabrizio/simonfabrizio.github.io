import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tema claro / oscuro ---------- */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');

  const label = () =>
    btn.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  label();

  const apply = (t: string) => {
    root.dataset.theme = t;
    meta?.setAttribute('content', t === 'dark' ? '#000000' : '#ffffff');
    label();
  };

  btn.addEventListener('click', (e) => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', next);
    } catch {}

    // Círculo que crece desde el botón (si el navegador lo soporta)
    if (!document.startViewTransition || reduceMotion()) {
      apply(next);
      return;
    }
    const x = e.clientX || window.innerWidth - 40;
    const y = e.clientY || 40;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => apply(next));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try {
      saved = localStorage.getItem('theme');
    } catch {}
    if (!saved) apply(e.matches ? 'dark' : 'light');
  });
}

/* ---------- Copiar email ---------- */
function initCopyEmail() {
  const btn = document.getElementById('copy-email');
  const status = document.getElementById('copy-status');
  if (!btn || !status) return;
  const email = btn.dataset.email ?? '';
  const initial = status.textContent;
  let timer: number | undefined;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = 'Email copiado. Pegalo en tu correo.';
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(() => (status.textContent = initial), 3000);
  });
}

/* ---------- Scroll suave ---------- */
function initLenis() {
  const lenis = new Lenis({ duration: 1.1, anchors: { offset: 0 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Entrada del nombre (el único momento orquestado) ---------- */
function initHero() {
  const title = document.querySelector<HTMLElement>('[data-split]');
  const meta = document.querySelector('[data-hero-meta]');
  if (!title) return;

  document.fonts.ready.then(() => {
    const split = SplitText.create(title, { type: 'chars', mask: 'chars' });
    gsap.set(title, { visibility: 'visible' });
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(split.chars, { yPercent: 110, duration: 1.3, stagger: 0.035 });
    if (meta) tl.from(meta, { opacity: 0, y: 16, duration: 1 }, '-=0.8');
  });
}

/* ---------- La foto del vivero pasa de blanco y negro a color al hacer scroll ---------- */
function initReveal() {
  const wrap = document.querySelector('[data-reveal-wrap]');
  const img = document.querySelector<HTMLImageElement>('[data-reveal-img]');
  if (!wrap || !img) return;

  img.classList.remove('grayscale', 'transition-[filter]');
  gsap.fromTo(
    img,
    { filter: 'grayscale(1)', scale: 1.15 },
    {
      filter: 'grayscale(0)',
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top 85%', end: 'center 45%', scrub: true },
    },
  );
  gsap.fromTo(
    wrap,
    { clipPath: 'inset(8% 6% 8% 6%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top 90%', end: 'top 30%', scrub: true },
    },
  );
}

/* ---------- Vista previa que sigue al cursor ---------- */
function initPreview() {
  const box = document.getElementById('preview');
  const img = box?.querySelector('img');
  if (!box || !img || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const xTo = gsap.quickTo(box, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(box, 'y', { duration: 0.5, ease: 'power3' });

  document.querySelectorAll<HTMLElement>('[data-preview]').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      img.src = row.dataset.preview!;
      gsap.to(box, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
    });
    row.addEventListener('mouseleave', () => gsap.to(box, { opacity: 0, scale: 0.9, duration: 0.25 }));
    row.addEventListener('mousemove', (e) => {
      xTo(e.clientX + 24);
      yTo(e.clientY - 90);
    });
  });
}

/* ---------- El menú se esconde al bajar y vuelve al subir ---------- */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  let lastY = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      header.dataset.hidden = String(y > 120 && y > lastY);
      lastY = y;
    },
    { passive: true },
  );
  // Si alguien navega con teclado, el menú vuelve a aparecer
  header.addEventListener('focusin', () => (header.dataset.hidden = 'false'));
}

export function initSite() {
  initTheme();
  initHeader();
  initCopyEmail();
  if (reduceMotion()) return; // sin animaciones: todo queda visible y estático
  initLenis();
  initHero();
  initReveal();
  initPreview();
}
