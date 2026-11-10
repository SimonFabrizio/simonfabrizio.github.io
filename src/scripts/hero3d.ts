import {
  AmbientLight,
  DirectionalLight,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

/**
 * Figura 3D de la portada: un poliedro facetado en blanco y negro con una
 * "jaula" de aristas que gira al revés. Sigue al mouse, reacciona al scroll
 * y cambia de color con el tema. Si `still` es true, dibuja un solo cuadro.
 */
export function mountHero3D(canvas: HTMLCanvasElement, still: boolean) {
  const mobile = matchMedia('(max-width: 767px)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    canvas.remove(); // sin WebGL: la portada queda como antes
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.z = 6;

  // En celular el nombre queda encima de la figura: la hacemos translúcida para que se lea bien
  const solidMat = new MeshStandardMaterial({
    flatShading: true,
    roughness: 0.55,
    metalness: 0.1,
    transparent: mobile,
    opacity: mobile ? 0.22 : 1,
  });
  const solid = new Mesh(new IcosahedronGeometry(1, 1), solidMat);

  const cageMat = new LineBasicMaterial({ transparent: true });
  const cage = new LineSegments(new EdgesGeometry(new IcosahedronGeometry(1.45, 0)), cageMat);

  const group = new Group();
  group.add(solid, cage);
  scene.add(group);

  const ambient = new AmbientLight(0xffffff, 1);
  const key = new DirectionalLight(0xffffff, 2.4);
  key.position.set(3, 4, 5);
  const rim = new DirectionalLight(0xffffff, 0.8);
  rim.position.set(-4, -2, -3);
  scene.add(ambient, key, rim);

  /* Colores según el tema: negro sobre blanco o blanco sobre negro */
  const applyTheme = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    solidMat.color.set(dark ? 0xd9d9d9 : 0x1a1a1a);
    ambient.intensity = dark ? 0.35 : 0.9;
    key.intensity = dark ? 2.6 : 2.2;
    cageMat.color.set(dark ? 0xffffff : 0x000000);
    cageMat.opacity = dark ? 0.35 : 0.3;
  };
  applyTheme();
  new MutationObserver(() => {
    applyTheme();
    if (still) draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* Tamaño */
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(() => {
    resize();
    if (still) draw();
  }).observe(canvas);
  resize();

  const draw = () => renderer.render(scene, camera);

  // Pose inicial agradable para el modo estático
  group.rotation.set(0.35, -0.5, 0);
  cage.rotation.set(0.2, 0.4, 0);

  if (still) {
    draw();
    return;
  }

  /* Mouse: la figura se inclina hacia el cursor */
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  if (finePointer) {
    window.addEventListener(
      'pointermove',
      (e) => {
        target.x = (e.clientX / innerWidth) * 2 - 1;
        target.y = (e.clientY / innerHeight) * 2 - 1;
      },
      { passive: true },
    );
  }

  /* Solo anima cuando se ve y la pestaña está activa */
  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) start();
  });

  let raf = 0;
  let last = performance.now();
  let spin = 0;

  const tick = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    // Al bajar, la figura gira más y se aleja un poco
    const scroll = Math.min(window.scrollY / innerHeight, 1.5);
    spin += dt * (0.25 + scroll * 0.6);

    const ease = 1 - Math.pow(0.002, dt); // suavizado independiente de los FPS
    current.x += (target.x - current.x) * ease;
    current.y += (target.y - current.y) * ease;

    group.rotation.y = spin + current.x * 0.6;
    group.rotation.x = 0.35 + current.y * 0.45 + scroll * 0.4;
    group.position.x = current.x * 0.15;
    group.position.y = -current.y * 0.12 + scroll * 0.6;
    group.scale.setScalar(1 - scroll * 0.15);

    cage.rotation.y = -spin * 1.6;
    cage.rotation.z = spin * 0.5;

    draw();
    raf = requestAnimationFrame(tick);
  };

  function start() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  start();
}
