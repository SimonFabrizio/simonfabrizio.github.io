// --- Email Copy Function ---
function copyEmail() {
    const email = "simon.fabrizio01@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const msg = document.getElementById('copy-message');
        const btn = document.getElementById('btn-email');
        msg.classList.add('show-msg');
        btn.style.borderColor = "#4ade80"; 
        btn.style.color = "#4ade80";
        setTimeout(() => {
            msg.classList.remove('show-msg');
            btn.style.borderColor = "var(--accent-color)";
            btn.style.color = "var(--accent-color)";
        }, 2000);
    });
}

// --- Mobile Menu & Scroll ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => { navLinks.classList.toggle('active'); });
document.querySelectorAll('.nav-links a').forEach(link => { navLinks.classList.remove('active'); });

// --- Animation Observer ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('show'); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));