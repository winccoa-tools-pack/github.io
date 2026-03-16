# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm ci
```

## Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Deployment is handled by **GitHub Actions** via [`.github/workflows/site.yml`](.github/workflows/site.yml).

- On every push to `main` (and on the daily schedule), the workflow builds the site and deploys it to GitHub Pages.
- Make sure the repository is configured as: **Settings → Pages → Source = GitHub Actions**.
