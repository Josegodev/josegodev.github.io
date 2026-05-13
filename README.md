# AI Portfolio - José González Oliva

Static technical portfolio for GitHub Pages, aimed at recruiters and technical reviewers evaluating Backend & AI Engineering work around FastAPI, RAG, LLM providers, Telegram integration, JSON traces, evaluation and operational observability.

This repository is a public, curated and safe view of work developed in private or local repositories and labs. It does not publish private source code, real document corpora, real logs, tokens, private IPs, local paths, credentials or confidential documentation.

The site is static. It uses only HTML, CSS and synthetic JSON examples. There is no React, Astro, Vite, npm, build step or external dependency.

## GitHub Pages

This repository is intended to be served as the user site `josegodev.github.io`.

Recommended GitHub Pages setup:

1. Open the repository settings in GitHub.
2. Go to `Pages`.
3. In `Build and deployment`, choose `Deploy from a branch`.
4. Select branch `main`.
5. Select folder `/root`.
6. Save.

GitHub Pages will serve `index.html` from the repository root.

## Content

- `index.html`: main portfolio page.
- `styles.css`: shared static styles.
- `case-studies/`: technical case studies.
- `ai-assisted-development.html`: transparency note about AI-assisted development.
- `samples/`: synthetic JSON examples.
- `docs/`: synchronized copy kept for compatibility if GitHub Pages is ever configured from `/docs`.

## Editing

- Edit root files first because the public site is served from root.
- Keep `/docs` synchronized only if it remains in the repository.
- Keep examples synthetic.
- Do not publish private logs, real traces, corpora, SQLite files, tokens, credentials, local paths, private IPs, customer data or confidential documentation.

## Maturity framing

The portfolio intentionally presents the work as:

- advanced prototype
- local experimental backend
- curated demo
- not production-ready
- not deployment-ready yet

Do not add claims about production cloud operation, enterprise security or high-concurrency readiness unless there is public, reproducible evidence.
