# Industron — Website

Marketing site for **Industron Nanotechnology Pvt Ltd** — advanced nanomechanical testing
instruments, R&D consultancy, and material testing services.

Built with **React + Vite**, routed with **react-router-dom**, animated with **framer-motion**,
and featuring a live 3D nanoindenter hero powered by **three.js + @react-three/fiber**.

## Prerequisites

- Node.js **18+** (tested on 20)
- npm 9+

## Scripts

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build locally
npm run lint       # ESLint over src/
npm run lint:fix   # ESLint with --fix
npm run format     # Prettier write
npm run format:check
```

## Project structure

```
src/
  main.jsx                  # React entry + BrowserRouter
  App.jsx                   # Navbar + <Routes> + Footer
  index.css                 # Global styles (white/blue theme)
  components/
    Navbar.jsx · Footer.jsx · ScrollToTop.jsx
    PageHero.jsx · PageCTA.jsx           # reusable page shells
    FuturisticWaveDots.jsx               # canvas background animation
    Hero.jsx · About.jsx · Research.jsx · Contact.jsx   # home-page sections
  pages/
    HomePage.jsx
    AboutPage.jsx · ProductsPage.jsx · ServicesPage.jsx
    ApplicationsPage.jsx · ContactPage.jsx · TestingFormPage.jsx
  three/
    NanoindenterScene.jsx                # 3D hero (Berkovich tip + live F-d curve)
public/
  industron-logo.png · industron-logo.svg · hero-lab-pattern.svg
  Website/
    Customer/  (customer logo PNGs)
    Person/    (leadership headshots)
```

## Routes

| Path | Purpose |
|---|---|
| `/` | Home (Hero + Services teaser + Customers + Contact teaser) |
| `/about` | Company, competencies, leadership |
| `/products` | Instrument portfolio (filterable) |
| `/services` | NRL testing, consultancy, training, agreements, support |
| `/applications` | Industry applications + testing techniques |
| `/contact` | Offices, support, testing, founder feedback |
| `/testing-form` | Sample testing enquiry (opens a mailto draft) |

## Editing content

Most pages are data-driven — copy lives in top-level arrays of the relevant page component
(e.g., `PRODUCTS` in `src/pages/ProductsPage.jsx`, `INDUSTRIES` in `ApplicationsPage.jsx`,
`LEADERS` in `AboutPage.jsx`, `CUSTOMERS` in `src/components/Research.jsx`). Edit the array,
save, hot reload.

## Adding images

Drop files into `public/` (or `public/Website/...`) and reference them with an absolute path
starting at `/` (e.g., `/Website/Customer/IITM.png`). Anything outside `public/` is **not**
copied into the production build.

## Deploying

Any static host (Netlify, Vercel, S3+CloudFront, GitHub Pages). Run `npm run build` and
publish the `dist/` folder. Configure SPA fallback (all routes → `/index.html`) so
client-side routing works on deep links.

---

© 2026 Industron Nanotechnology Pvt Ltd.
