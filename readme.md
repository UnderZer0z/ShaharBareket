# Shahar Bareket Portfolio

My personal website and portfolio built with Astro and integrated with Decap CMS, deployed on GitHub Pages.

## Project Structure

- `src/pages/` — Page templates and routes:
  - `index.astro` — Main landing page.
  - `blog/[slug].astro` — Dynamic route for reading local blog posts.
- `src/components/` — Reusable Astro components (`ProjectCard`, `ContactForm`).
- `src/layouts/` — Layout templates (`Layout.astro`).
- `src/content/` — Markdown content collections and schemas:
  - `projects/` — Portfolio projects.
  - `blog/` — Blog posts.
- `public/` — Static assets, fonts, and Decap CMS admin files:
  - `admin/` — Decap CMS dashboard and configuration.

## Development

To run the local development server:
```sh
npm run dev
```

To run Decap CMS locally for editing content:
1. Start the Decap CMS local proxy server:
   ```sh
   npx decap-cms-proxy-server
   ```
2. Start the dev server (`npm run dev`) and visit `http://localhost:4321/admin/` in your browser.

## Production Build

To compile the static pages:
```sh
npm run build
```
The site builds into the `dist/` directory, which is deployed to GitHub Pages.
