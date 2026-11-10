# Portafolio de Simón Fabrizio

Estudiante de **Ingeniería en Sistemas de Información (UTN)** y desarrollador web de Argentina.

👉 **Online:** https://simonfabrizio.github.io/

## Tecnologías

- **[Astro](https://astro.build/):** genera un sitio estático, rápido y sin JavaScript de más.
- **[Tailwind CSS](https://tailwindcss.com/):** estilos con un sistema de diseño en blanco y negro (`src/styles/global.css`).
- **[GSAP](https://gsap.com/)** con ScrollTrigger y SplitText: la entrada letra por letra del nombre y la foto del vivero que pasa de blanco y negro a color al hacer scroll.
- **[Lenis](https://lenis.darkroom.engineering/):** scroll suave.
- **View Transitions API:** el cambio a modo oscuro se expande en círculo desde el botón.
- Tipografías Bricolage Grotesque y Geist, servidas desde el propio sitio.

## Detalles de UX

- Menú de comandos con `Ctrl K` / `⌘K`: ir a cualquier sección, copiar el email, cambiar el tema o abrir GitHub y LinkedIn.
- El proyecto principal se cuenta como caso de estudio: desafío, lo que hice, resultado y lo que aprendí.
- Modo claro y oscuro: sigue al sistema y recuerda la elección.
- El menú se esconde al bajar y vuelve al subir.
- Vista previa de cada proyecto que sigue al cursor (solo en escritorio).
- Tocar el email lo copia; si el navegador no deja, abre el correo.
- Respeta "reducir movimiento": sin animaciones, todo queda visible.
- Enlace "Saltar al contenido" y foco visible para navegar con teclado.

## Proyecto destacado

**La Galería de las Plantas:** sitio de un vivero real con stock en vivo, panel de administración y Supabase. https://lagaleriadelasplantas.netlify.app/

## Trabajar en el proyecto

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

## Estructura

```text
src/
├── layouts/Base.astro   # <head>, SEO y tema inicial
├── pages/index.astro    # contenido de la página
├── scripts/site.ts      # animaciones, tema, menú y copiar email
└── styles/global.css    # paleta, tipografías y Tailwind
public/img/              # capturas de los proyectos (WebP)
```

## Publicación

Cada push a `main` compila y publica el sitio con GitHub Actions (`.github/workflows/deploy.yml`).
En **Settings > Pages**, la opción *Source* tiene que estar en **GitHub Actions**.
