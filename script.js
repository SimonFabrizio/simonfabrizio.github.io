// --- Modo oscuro: respeta el sistema y recuerda la elección ---
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function aplicarTema(tema) {
    root.dataset.tema = tema;
    themeToggle.setAttribute('aria-label', tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}
aplicarTema(root.dataset.tema || 'claro');

themeToggle.addEventListener('click', () => {
    const nuevo = root.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
    aplicarTema(nuevo);
    try { localStorage.setItem('tema', nuevo); } catch (e) { /* sin almacenamiento: igual cambia */ }
});

// Si el usuario no eligió, seguir los cambios del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let guardado = null;
    try { guardado = localStorage.getItem('tema'); } catch (err) {}
    if (!guardado) aplicarTema(e.matches ? 'oscuro' : 'claro');
});

// --- Menú del celular ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function cerrarMenu() {
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú');
}

hamburger.addEventListener('click', () => {
    const abierto = navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(abierto));
    hamburger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});
navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', cerrarMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarMenu(); });

// --- Copiar email ---
const EMAIL = 'simon.fabrizio01@gmail.com';
const copyMsg = document.getElementById('copy-message');

document.getElementById('btn-email').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(EMAIL);
        copyMsg.textContent = '¡Email copiado!';
    } catch (e) {
        window.location.href = 'mailto:' + EMAIL;
        return;
    }
    setTimeout(() => { copyMsg.textContent = ''; }, 2500);
});

// --- Animaciones al hacer scroll ---
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach((el) => observer.observe(el));
} else {
    reveals.forEach((el) => el.classList.add('show'));
}

document.getElementById('year').textContent = new Date().getFullYear();
