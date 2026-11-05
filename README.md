# hidel21.github.io

<img src="assets/img/brand/hideldev-logo-light.svg" alt="Hideldev" height="48">

Portafolio personal de **Hidelberg Martínez Espitia (Hideldev)** — Desarrollador Senior & Especialista Odoo.

🔗 https://hidel21.github.io/

## Stack

Sitio estático sin dependencias ni paso de build, servido por GitHub Pages:

- **HTML semántico** con todo el contenido en el documento (SEO y funciona sin JavaScript).
- **CSS** con tokens de diseño, tema claro/oscuro y `prefers-reduced-motion`.
- **JavaScript vanilla** para la interactividad: paleta de comandos (`Ctrl/⌘ + K`), filtros de proyectos,
  pestañas accesibles, ventana de código con resaltado de sintaxis y actividad de GitHub en vivo.

## SEO

- Páginas de servicio con contenido propio: `/desarrollador-odoo/`, `/facturacion-electronica-odoo/` y `/migracion-odoo/`.
- Versión en inglés en `/en/` (portada y tres servicios), enlazada con `hreflang` y un selector ES/EN en la cabecera.
  El JavaScript detecta el idioma por `<html lang>` y traduce sus textos.
- Blog en `/blog/`. Cada artículo nuevo: carpeta propia con `index.html`, entrada en `/blog/index.html`,
  `sitemap.xml` y `llms.txt`.
- Datos estructurados (JSON-LD): `ProfilePage` + `Person` + `FAQPage` en la portada; `Service` + `BreadcrumbList` + `FAQPage` en cada servicio.
- `sitemap.xml`, `robots.txt` (permite buscadores y asistentes de IA) y `llms.txt` (resumen para modelos de lenguaje).
- Al editar contenido, actualiza `lastmod` en `sitemap.xml` y la fecha «Actualizado el…» de la página.

## Estructura

```
index.html              Página principal (contenido)
assets/css/styles.css   Estilos
assets/js/main.js       Interacciones
assets/cv/              CV descargable en PDF
assets/img/             Favicon
404.html, robots.txt, sitemap.xml, site.webmanifest
```

## Marca Hideldev

El símbolo `h_` une la inicial con un cursor de terminal: *hidel* + *dev*.

| Archivo | Uso |
|---|---|
| `assets/img/brand/hideldev-icon.svg` | Icono maestro (vector) |
| `assets/img/brand/hideldev-icon-small.svg` | Variante de trazo grueso para 16–32 px |
| `assets/img/brand/hideldev-icon-512.png`, `-192.png` | Avatares, PWA |
| `assets/img/brand/hideldev-icon-maskable-512.png` | Icono adaptable de Android |
| `favicon.ico` (16/32/48), `apple-touch-icon.png` | Navegadores e iOS |
| `assets/img/brand/hideldev-logo-dark.svg/.png` | Logotipo sobre fondo oscuro |
| `assets/img/brand/hideldev-logo-light.svg/.png` | Logotipo sobre fondo claro |
| `assets/img/brand/og-image.jpg` | Vista previa al compartir el enlace (1200×630) |
| `assets/img/brand/linkedin-banner.png` | Portada de LinkedIn (1584×396) |

Colores: tinta `#0d0e14`, violeta `#8b5cf6`, turquesa `#2dd4bf`, blanco `#ffffff`.
Tipografía: Geist (los logotipos SVG tienen el texto convertido a trazos y no dependen de la fuente).

## Desarrollo local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Actualizar contenido

- **Proyectos:** cada tarjeta es un `<li class="card project">` dentro de `#projects-grid` en `index.html`.
  El atributo `data-category` (`odoo`, `fullstack`, `data`, `seo`) controla los filtros.
- **Experiencia:** un botón en `.exp-tabs` y un `<article class="exp-panel">` por empresa.
- **CV:** la fuente es `assets/cv/cv.html`. Para regenerar el PDF:
  ```bash
  google-chrome --headless=new --no-pdf-header-footer \
    --print-to-pdf=assets/cv/Hidelberg-Martinez-CV.pdf assets/cv/cv.html
  ```
- **Repositorios ocultos** en la actividad de GitHub: expresión `EXCLUDE` en `assets/js/main.js`.
