# StreamVault — Netflix UI Clone (Learning Project)

> **Disclaimer:** This project is a front-end UI clone built solely for **learning and portfolio purposes**.
> It is **not affiliated with, endorsed by, or sponsored by Netflix, Inc.**
> All Netflix trademarks, logos, and brand assets belong to Netflix, Inc.
> Movie and TV data is provided by [TMDB](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.

---

## Overview

StreamVault is a pixel-faithful Netflix UI clone built with **React 19** and **Vite**. It replicates the Netflix browsing experience — landing page, sign-in flow, browse page with scrollable movie rows, hover card expansion, live search, and a title detail modal — while sourcing real-time content from the TMDB API.

This project was built to practise and showcase:

- Component-driven architecture with React hooks
- Responsive CSS using CSS Modules and custom properties
- Consuming a third-party REST API (TMDB) with environment-variable key management
- Custom JS-driven horizontal carousel (no scroll-overflow hacks)
- Accessible markup (ARIA roles, keyboard navigation, focus management)
- Clean code organisation and separation of concerns

---

## Features

| Feature | Details |
|---|---|
| Landing page | Hero, trending Top-10 row (live TMDB), feature cards, FAQ accordion, email CTA |
| Browse page | Sticky navbar, hero spotlight, 6 live TMDB content rows, horizontal carousel with JS transform scroll |
| Card hover | Smooth bi-directional expand animation, title, rating, genre tags, action buttons |
| Search | Debounced live search against TMDB, result row with hero |
| Title detail modal | Backdrop image, full metadata (genres, runtime, vote count, networks, homepage) |
| Sign-in page | Form validation, responsive layout |
| Responsive | Hamburger nav ≤ 768 px, scaled cards at 900 px and 600 px breakpoints |
| Fallback | Static local data when no API key is configured |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI library | React 19 |
| Build tool | Vite 6 |
| Styling | CSS Modules + CSS custom properties |
| Data | TMDB REST API v3 |
| Icons | Inline SVG via custom `Icon` component |
| Fonts | Google Fonts — Bebas Neue, Manrope |
| Linting | ESLint |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/streamvault.git
cd streamvault

# 2. Install dependencies
npm install

# 3. Create the environment file
cp .env.example .env.local

# 4. Add your TMDB API key
# Open .env.local and set:
VITE_TMDB_API_KEY=your_real_tmdb_key_here

# 5. Start the development server
npm run dev
# → http://localhost:4000
```

The app works without an API key — it falls back to local static data automatically.

---

## Available Scripts

```bash
npm run dev       # Start Vite dev server on port 4000
npm run build     # Production build → ./dist
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
├── assets/              # Static images (posters, backdrop, logo)
├── components/
│   ├── BrowsePage/      # Main browse screen with rows + detail modal
│   ├── Footer/          # Shared footer with legal notice + TMDB credit
│   ├── Header/          # Thin wrapper around NavBar
│   ├── HeroBanner/      # Full-bleed spotlight hero
│   ├── Icon/            # Custom SVG icon component
│   ├── LandingPage/     # Marketing landing page
│   ├── MovieRow/        # Horizontal scroll row with hover expansion
│   ├── NavBar/          # Sticky navbar + mobile hamburger menu
│   └── SignInPage/      # Sign-in form
├── data/
│   ├── catalog.js       # Local fallback content + browse model builder
│   └── movies.js        # Local static movie list
├── services/
│   └── movieService.js  # TMDB API calls + data mapping
├── App.jsx              # Root — screen state machine (landing / signin / browse)
├── App.module.css       # App-level layout styles
└── index.css            # Global reset, CSS custom properties, fonts
```

---

## Deployment

This app ships as a single Node process: `server.js` runs the Express API
and also serves the built frontend (`npm run build` → `dist/`), so one
process handles everything — no separate static host needed.

### Hostinger (Node.js App via hPanel)

1. Push this repo to GitHub.
2. In hPanel, create a **Node.js App**:
   - **Application root:** the folder containing `server.js` and `package.json`
   - **Application startup file:** `server.js`
   - **Node version:** any current LTS
3. Run `npm install` and `npm run build` in that app's context (hPanel's
   deploy tooling, or via SSH) so `dist/` exists alongside `server.js`.
4. In the Node app's environment variables panel, set everything listed in
   `.env.example`: `VITE_TMDB_API_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`,
   `MYSQL_HOST`/`MYSQL_PORT`/`MYSQL_USER`/`MYSQL_PASSWORD`/`MYSQL_DATABASE`,
   `JWT_SECRET`, and `CORS_ORIGIN` (your real domain).
5. Create the MySQL database in hPanel and run `schema.sql` against it.
6. Make sure the domain is bound to this Node app — check the generated
   `.htaccess` in the app root has `PassengerBaseURI "/"` so requests to
   `/api/*` are actually proxied to the Node process instead of falling
   through to static file serving.
7. Start/restart the app from hPanel.

> **Important:** Never commit real secrets. All `.env*` files except
> `.env.example` are listed in `.gitignore` and will not be pushed to GitHub.

---

## Attribution & Credits

- UI design inspired by [Netflix](https://www.netflix.com) — all trademarks belong to Netflix, Inc.
- Movie and TV data provided by [The Movie Database (TMDB)](https://www.themoviedb.org)
- Built as part of the **Evangadi Phase 4** front-end curriculum

---

## License

This project is released for **educational and portfolio use only**. It is not intended for commercial use or public deployment as a production service.
