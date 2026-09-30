# FinScore – Your Money Health Score

FinScore is a browser-only personal finance checkup for Indian users. It collects information about income, spending, savings, emergency reserves, insurance, debt, investments, and retirement planning, then calculates a score out of 100 across six money-health dimensions.

The app also provides a visual score dashboard and up to five personalized recommendations based on the answers. All state and scoring logic run locally in the browser. There is no backend, database, authentication service, API route, or API key.

## Live demo

[Open FinScore](https://money-health-score--erstutidhawan.replit.app)

## Tech stack

- React 19
- Vite 7
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Wouter
- Radix UI primitives
- Lucide icons
- Canvas Confetti

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Setup

1. Extract this folder or clone the repository.
2. Open a terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` if you want an environment file for local conventions. FinScore currently has no environment variables to configure.
5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown by Vite, normally `http://localhost:5173`.

## Available scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check and create a production build in dist/
npm run start     # Preview the production build locally
npm run typecheck # Run TypeScript checks without building
```

For a production preview:

```bash
npm run build
npm run start
```

The preview server normally runs at `http://localhost:4173`.

## Environment variables and secrets

No secrets or API keys are used. The `.env` file is intentionally empty apart from an explanatory comment, and `.env` is ignored by Git. If an external service is added later, put only its public, browser-safe configuration in Vite variables prefixed with `VITE_`; never put private keys in frontend code.

## Project structure

```text
finscore/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env
├── .env.example
├── .gitignore
├── README.md
├── public/
│   ├── favicon.svg
│   ├── opengraph.jpg
│   └── images/
│       └── fintech-bg.png
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components/
    │   ├── ScoreGauge.tsx
    │   └── ui/
    ├── hooks/
    ├── lib/
    └── pages/
```

The `src/components/ui/` directory contains the reusable UI primitives included with the original app. Vite bundles only the components imported by the running application.