# 00: Foundations

**Goal:** A clean, typed, reproducible project that builds locally and in CI, before any feature work.
**Depends on:** none
**Status:** nearly done. Remaining: first commit, a real database run, CI proven on GitHub

## Scope

Repo hygiene, tooling, environment handling, project structure, CI skeleton.

## Out of scope

Features, content, design.

## Tasks

- [x] Next.js 16 + Payload 3 + TypeScript project files (`package.json`, `tsconfig.json`, `next.config.mjs`)
- [x] Folder structure: `src/{app,collections,access,fields,i18n}`
- [x] `.gitignore`, `.env.example`
- [x] `git init` on branch `main`
- [ ] First commit (waiting for the owner's go-ahead)
- [x] Clean install works; `typecheck` and `build` pass
- [x] ESLint + Prettier configured, `npm run lint` and `npm run format:check`
- [x] `engines` pinned, `.nvmrc`
- [x] GitHub Actions: install, lint, format, typecheck, build on every PR (not yet run on GitHub)
- [x] Dependabot config (npm, weekly) and `npm audit` step in CI
- [x] Secret scanning (gitleaks action) in CI
- [x] `README.md`: setup, scripts, env variables, project layout
- [ ] Local database option documented (Neon branch or Docker Postgres)
- [ ] Verify dev server and admin first-user flow against a real Postgres

## Acceptance criteria

- A new machine can go from clone to running dev server using only the README.
- CI fails on a type error, lint error or failed build.
- No secret value exists in the repo or its history.

## Security

- `.env*` ignored except `.env.example`; `PAYLOAD_SECRET` is required and never defaulted in production.
- Dependencies are pinned through the lockfile; install scripts reviewed (`sharp`, `esbuild`).

## Tests

- CI pipeline itself is the test: break the build on purpose in a throwaway branch and confirm it goes red.

## Decisions

- Single Next.js + Payload app (no separate Backend/Frontend).
- Package manager: npm.
