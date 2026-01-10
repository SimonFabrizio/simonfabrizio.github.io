// Traducciones Actualizadas
const translations = {
    es: {
        nav_about: "Sobre mí",
        nav_skills: "Habilidades",
        nav_projects: "Proyectos",
        nav_contact: "Contactar",
        hero_badge: "Desarrollador Web Junior",
        hero_role: "Desarrollador Fullstack & Estudiante UTN",
        hero_desc: "Actualmente cursando el 2.º año de <strong>Ingeniería en Sistemas</strong>. Combino la lógica de la ingeniería con la creatividad del desarrollo web.",
        btn_projects: "Ver Proyectos",
        btn_contact: "Hablemos",
        about_p1: "Soy un apasionado por la tecnología de 20 años. Actualmente curso el **2.º año de Ingeniería en Sistemas en la UTN**, lo que me brinda una base sólida en algoritmos y lógica.",
        about_p2: "Mi enfoque es **resolver problemas reales**. Desde la gestión eficiente en un trabajo diario hasta el desarrollo de software complejo.",
        edu_title: "Educación",
        skill_web: "Desarrollo Web",
        skill_cs: "Ingeniería de Software",
        proj1_desc: "Solución real para un vivero. Permite administrar stock y precios desde Google Sheets sin backend complejo.",
        proj2_title: "Gestión de Taller Mecánico",
        proj2_desc: "Sistema en C para turnos y facturación. Implementa estructuras dinámicas y algoritmos de ordenamiento.",
        contact_title: "¿Listo para trabajar juntos?",
        contact_desc: "Busco mi primera oportunidad profesional. Si buscas alguien proactivo y con buena base lógica, contáctame."
    },
    en: {
        nav_about: "About",
        nav_skills: "Skills",
        nav_projects: "Projects",
        nav_contact: "Contact",
        hero_badge: "Junior Web Developer",
        hero_role: "Fullstack Developer & Engineering Student",
        hero_desc: "Currently in my 2nd year of <strong>Systems Engineering</strong>. I combine engineering logic with web development creativity.",
        btn_projects: "View Projects",
        btn_contact: "Let's Talk",
        about_p1: "I am a 20-year-old tech enthusiast. I am currently in my **2nd year of Systems Engineering at UTN**, giving me a strong foundation in algorithms and logic.",
        about_p2: "My focus is on **solving real problems**. From efficient daily work management to complex software development.",
        edu_title: "Education",
        skill_web: "Web Development",
        skill_cs: "Software Engineering",
        proj1_desc: "Real-world solution for a plant nursery. Manages stock and prices from Google Sheets without a complex backend.",
        proj2_title: "Mechanic Workshop Manager",
        proj2_desc: "System in C for appointments and billing. Implements dynamic structures and sorting algorithms.",
        contact_title: "Ready to work together?",
        contact_desc: "I am looking for my first professional opportunity. If you need someone proactive with a strong logical base, contact me."
    }
};

// --- Theme Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// --- Language Toggle ---
const langToggle = document.getElementById('lang-toggle');
const langText = document.querySelector('.lang-text');
let currentLang = 'es';

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    langText.textContent = currentLang === 'es' ? 'EN' : 'ES'; 
    updateLanguage();
});

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
             let text = translations[currentLang][key];
             // Parse simple markdown bold
             text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
             element.innerHTML = text;
        }
    });
}

// --- Email Copy Function ---
function copyEmail() {
    const email = "simon.fabrizio01@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const msg = document.getElementById('copy-message');
        const btn = document.getElementById('btn-email');
        
        msg.classList.add('show-msg');
        btn.style.borderColor = "#4ade80"; // Verde
        btn.style.color = "#4ade80";
        
        setTimeout(() => {
            msg.classList.remove('show-msg');
            btn.style.borderColor = "var(--accent-color)";
            btn.style.color = "var(--accent-color)";
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

// --- Mobile Menu ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// --- Scroll Animation ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));