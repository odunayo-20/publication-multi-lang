# Build Procedure

The site is built module by module, in order. No module starts until the previous one meets its Definition of Done.

## Roles (each module is reviewed through all four lenses)

| Role     | Question they ask before a module is "done"                                 |
| -------- | --------------------------------------------------------------------------- |
| Engineer | Is it simple, typed, and does it build and typecheck cleanly?               |
| Designer | Is it readable, accessible, responsive, and consistent in both languages?   |
| Tester   | Do the acceptance criteria have passing tests? Did I try to break it?       |
| Security | What can an attacker do with this? Is the least-privilege path the default? |

## Order

| #   | Module                            | Spec                                                       | Depends on         |
| --- | --------------------------------- | ---------------------------------------------------------- | ------------------ |
| 00  | Foundations                       | [modules/00-foundations.md](modules/00-foundations.md)     | none               |
| 01  | Content model                     | [modules/01-content-model.md](modules/01-content-model.md) | 00                 |
| 02  | Internationalization              | [modules/02-i18n.md](modules/02-i18n.md)                   | 01                 |
| 03  | Auth, roles, editor workflow      | [modules/03-auth-roles.md](modules/03-auth-roles.md)       | 01                 |
| 04  | Public site and design system     | [modules/04-public-site.md](modules/04-public-site.md)     | 01, 02             |
| 05  | Discovery: search, tags, SEO, RSS | [modules/05-discovery.md](modules/05-discovery.md)         | 04                 |
| 06  | Newsletter                        | [modules/06-newsletter.md](modules/06-newsletter.md)       | 04                 |
| 07  | Security hardening                | [modules/07-security.md](modules/07-security.md)           | 03, 05, 06         |
| 08  | Testing and quality gates         | [modules/08-testing.md](modules/08-testing.md)             | runs alongside all |
| 09  | Deployment and operations         | [modules/09-deploy-ops.md](modules/09-deploy-ops.md)       | 07, 08             |

Module 08 is not a final step. Its tooling is set up during module 00, and each module adds its own tests.

## Working rules

1. **Spec first.** Before coding a module, re-read its spec and adjust it if reality changed. Update the spec in the same change.
2. **Small steps.** One task per commit, each leaving the build green.
3. **Tests with the code.** A task is not done without the tests listed for it.
4. **Security is not a phase.** Every module has a Security section that is checked as part of its Definition of Done. Module 07 is the extra audit layer.
5. **Both languages always.** Any user-facing string or content path is verified in `en` and `hr`.
6. **Ask the owner** for product decisions (brand, copy, scope changes). Record them in the module's Decisions section.

## Definition of Done (every module)

- [ ] All Tasks checked
- [ ] All Acceptance criteria demonstrably met
- [ ] `npm run typecheck` and `npm run build` pass
- [ ] Tests for the module pass in CI
- [ ] Security section reviewed
- [ ] Works in `en` and `hr`, on mobile and desktop
- [ ] Spec updated to match what was built
