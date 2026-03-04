# ChatGPT++ Website

The official marketing and documentation website for the ChatGPT++ browser extension.

---

## Overview

This repository contains the source code for the ChatGPT++ website — a server-rendered web application built with Next.js 14 using the App Router. The site functions as the primary landing page, documentation hub, and legal reference for the ChatGPT++ browser extension.

The site is structured around a strict black-and-white visual identity, with no color accents. It prioritizes readability, performance, and accessibility.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Animations:** Framer Motion
- **Deployment:** Vercel

---

## Features

- **Animated UI** — Page sections use entrance animations and scroll-driven transitions via Framer Motion, applied consistently throughout the site.
- **Black and white theme** — A monochromatic design system with no color accents. Typography and spacing carry the visual hierarchy.
- **Landing page** — Composed of discrete sections: hero, feature highlights, and architecture overview.
- **Documentation page** — A dedicated `/docs` route covering extension usage and configuration.
- **Privacy page** — A `/privacy` route presenting the full privacy policy in a structured, readable format.
- **Custom 404 page** — A fully styled not-found experience consistent with the site design language.

---

## Development Setup

### Prerequisites

- Node.js 18.17 or later
- npm (or yarn / pnpm / bun)

### 1. Clone the repository

Clone the repository from GitHub, then navigate into the project directory:

```bash
cd app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

Hot module replacement is enabled by default. Changes to any file under `src/` are reflected in the browser immediately without a full page reload.

---

## Production Build

Compile and optimize the application for production:

```bash
npm run build
```

Preview the production output locally:

```bash
npm run start
```

---

## Deployment

This project is deployed via [Vercel](https://vercel.com). Vercel detects the Next.js framework automatically and applies the correct build configuration without additional setup.

### Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Deploy via Vercel Dashboard

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Vercel will detect Next.js automatically. No additional configuration is required.
3. Push to the `main` branch to trigger automatic production deployments.

Environment variables, if needed, are managed through the Vercel project dashboard under **Settings > Environment Variables**.

---

## Folder Structure

```
app/
├── public/                        # Static assets served at the root path
├── src/
│   ├── app/                       # Next.js App Router — pages and layouts
│   │   ├── globals.css            # Global styles
│   │   ├── icon.svg               # Site favicon
│   │   ├── layout.tsx             # Root layout with metadata and font setup
│   │   ├── page.tsx               # Landing page (/)
│   │   ├── not-found.tsx          # Custom 404 page
│   │   ├── docs/
│   │   │   └── page.tsx           # Documentation page (/docs)
│   │   └── privacy/
│   │       └── page.tsx           # Privacy policy page (/privacy)
│   ├── components/
│   │   ├── sections/              # Full-width page sections
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── architecture.tsx
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── privacy.tsx
│   │   └── ui/                    # Reusable UI primitives (shadcn/ui)
│   │       └── button.tsx
│   └── lib/
│       └── utils.ts               # Shared utility functions
├── components.json                # shadcn/ui configuration
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json
```

---

## Related Repository

The source code for the ChatGPT++ browser extension is maintained in a separate repository. The extension and this website are developed independently.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

You are free to use, modify, and distribute this software in accordance with the terms of the license.
