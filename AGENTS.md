# Repository Guidelines

## Project Structure & Modules
- `app/`: Laravel application code (PSR-4 `App\`).
- `resources/`: Frontend assets and Statamic UI
  - `views/**/*.antlers.html` (Antlers templates, partials prefixed with `_`)
  - `css/`, `js/`, `blueprints/`, `fieldsets/`
- `content/`: Statamic content (flat files).
- `routes/`: Laravel routes (e.g., `web.php`).
- `public/`: Public assets; Vite build output.
- `tests/`: PHPUnit tests (`Unit/`, `Feature/`).
- `config/`, `database/`, `storage/`: Standard Laravel.

## Build, Test, and Development
- Install deps: `composer install && npm ci`
- Local dev (queue + logs + Vite): `composer dev`
- Serve app (if needed): `php artisan serve`
- Frontend dev only: `npm run dev`
- Build assets: `npm run build`
- Run tests: `composer test`
- Static analysis: `composer lint`
- Format code: `composer fmt` (Pint + Prettier)
- Rector dry run: `composer refactor:test`

## Coding Style & Naming
- PHP: PSR-12 via Laravel Pint; 4-space indent.
- JS/CSS/Antlers: Prettier (see `prettier.config.js`), Antlers plugin enabled.
- PHP naming: `StudlyCase` classes, `camelCase` methods/vars, `UPPER_SNAKE_CASE` constants.
- Antlers partials: prefix with `_` (e.g., `views/components/_navbar.antlers.html`).
- Namespaces follow PSR-4 under `App\` (e.g., `app/Http/Controllers`).

## Testing Guidelines
- Framework: PHPUnit (`phpunit.xml`).
- Location: `tests/Unit/*Test.php`, `tests/Feature/*Test.php`.
- Conventions: One assertion focus per test; use factories/fakes.
- Run: `composer test`. Aim to cover new logic and critical paths.

## Commit & Pull Requests
- Commits: Conventional style preferred (e.g., `feat: ...`, `chore: ...`).
- PRs: Include a concise summary, linked issue (if any), and screenshots/GIFs for UI/template changes.
- Checklist: passing CI, tests updated, `composer fmt` clean.

## Security & Config
- Copy env: `cp .env.example .env`; never commit `.env`.
- Keep secrets in `.env`; use sane defaults in config.
- Validate third-party keys locally before PRs.

## Notes for Contributors
- This site uses Statamic 5 with Antlers, Laravel 12, Vite, Tailwind 4, and Alpine.js. Prefer Antlers components for presentational markup and keep PHP controllers slim.
