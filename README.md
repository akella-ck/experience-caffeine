# Experience Caffeine

Experience Caffeine is a responsive coffee education platform designed as a practical, premium coffee laboratory. It connects coffee origin, roast, brewing method, grinder calibration, guided technique, taste diagnosis, and brew journaling in one coherent learning loop.

The current release is a production-quality frontend foundation. Its recommendations are deterministic local starting points—not universal grinder calibrations—and the data and calculation layers are intentionally separated from the interface so a verified recommendation service or cloud backend can be introduced later.

## Features

- Immersive homepage with a bean-to-cup learning journey
- Filterable coffee origin and flavor explorer
- Live Brew Lab recipe configurator with grinder-specific starting ranges
- Guided, mobile-first V60 brew timer
- Brewing-method library and detailed education pages
- Grinder library with calibration, cleaning, settings, and visual grind comparisons
- Structured learning tracks and a detailed grind-size lesson
- Taste troubleshooter that changes one major variable at a time
- Local brew journal with filtering, duplication, deletion, and summary analytics
- Public, individual-member, and corporate-member experiences with centralized demo access rules
- Individual dashboard, saved-recipe previews, equipment profile, and preference profile
- Public Experience Caffeine for Business offering for cafés and coffee roasters
- Corporate operations workspace for roast profiles, recipes, quality, learning, teams, locations, and integrations
- Educational roast-session simulator and a mock-only roaster adapter boundary
- Typed domain data, deterministic recipe logic, and unit tests
- Responsive navigation, accessible controls, reduced-motion support, and SEO metadata

## Technology stack

- Next.js 16 App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Vitest
- Local structured TypeScript data plus browser storage for the journal and demo session

No database, production authentication provider, payment system, fake API layer, or real equipment connection is included in this phase. The login is a deliberately client-side demonstration and is not a security boundary.

## Project structure

```text
src/
├── app/                  # Routes, metadata, sitemap, robots, and route layouts
│   ├── brew-lab/
│   ├── brew-methods/
│   ├── corporate/          # Protected corporate workspace
│   ├── dashboard/          # Individual member dashboard
│   ├── explore/
│   ├── for-business/       # Public corporate offering
│   ├── grinders/
│   ├── guided-brew/
│   ├── journal/
│   ├── learn/
│   ├── login/
│   ├── profile/
│   └── troubleshoot/
├── auth/                  # Central session, role, access, and navigation policy
├── components/           # Reusable visual and interactive components
├── data/                 # Consumer and corporate typed mock knowledge
├── lib/                  # Pure calculations, diagnostics, and integration adapters
└── types/                # Consumer and corporate domain interfaces and unions
docs/
├── CORPORATE_PLATFORM.md
└── PRODUCT_ROADMAP.md
public/
└── brand-mark.svg
```

## Installation

Requirements: Node.js 22.13 or newer and pnpm 11 or newer. Node.js 24 LTS is recommended and used in CI.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
pnpm dev         # Start local development
pnpm lint        # Run ESLint
pnpm typecheck   # Run strict TypeScript checks
pnpm test        # Run deterministic-rule unit tests
pnpm build       # Create a production build
pnpm build:pages # Create the static GitHub Pages export in out/
pnpm start       # Serve the production build
```

## GitHub Pages deployment

The repository includes `.github/workflows/deploy-pages.yml`. Every push to `main` validates the application, creates a static export, and publishes the `out/` directory through GitHub Pages.

The workflow derives the project-site base path and public URL from the GitHub repository automatically. This keeps client navigation, `_next` assets, video placeholders, metadata, the sitemap, and the favicon valid at URLs such as `https://github-user.github.io/experience-caffeine/`.

To publish:

1. Push the project to a public GitHub repository with `main` as its default branch.
2. Open **Settings → Pages** in GitHub and set **Source** to **GitHub Actions**.
3. Run the workflow or push a commit to `main`.
4. Use the deployment URL shown in the workflow summary.

For a local project-path export, set the same values the workflow supplies:

```bash
NEXT_PUBLIC_BASE_PATH=/experience-caffeine \
NEXT_PUBLIC_SITE_URL=https://your-user.github.io/experience-caffeine \
pnpm build:pages
```

GitHub Pages is a static host. Any future server actions, authenticated APIs, or database-backed functionality will need a separate backend or a server-capable deployment target.

## Access levels

The client exposes three product experiences from one centralized access policy:

| Experience | What it includes |
| --- | --- |
| Public visitor | Homepage, origins, method and grinder overviews, selected beginner learning, public previews, and the business offering |
| Individual member | Full Brew Lab, guided brewing, journal, troubleshooting, detailed guides, profile, saved-recipe previews, and personal analytics |
| Corporate member | Corporate dashboard, roasting, profile and recipe management, quality, learning, troubleshooting, integrations, equipment, team, and locations |

Protected content is checked by reusable role gates before it renders. Hiding navigation is only a presentation improvement; it is not treated as authorization.

### Demo login

These credentials are included only for this controlled frontend demonstration:

| Experience | Email | Password |
| --- | --- | --- |
| Individual | `test@experiencecaffeine.com` | `coffeeistheanswer` |
| Corporate | `cafe@experiencecaffeine.com` | `whatsyourorder` |

The login page includes a small demo helper for testing. “Remember session” stores the mock session in `localStorage`; otherwise it uses `sessionStorage`. Logout clears both. No password is transmitted to a backend.

The repository’s `pnpm dev` and `pnpm build` scripts explicitly set `NEXT_PUBLIC_DEMO_MODE=true` for this review build. If the application is built outside those scripts, the credential matcher and visible password helper stay disabled unless that public demo flag is deliberately enabled.

**Security warning:** these passwords are present in client source and therefore public to anyone who receives the build. Never use this pattern or these credentials in a real deployment.

## Role-based route architecture

Public education routes remain useful without signing in. Full consumer tools accept individual members and, where appropriate, corporate members; the journal and individual dashboard accept only the individual role. The entire `/corporate/*` tree requires the corporate role. A cross-role attempt renders an explicit access-denied state instead of relying on hidden links.

Because the current check runs in the browser, a user can modify browser storage or frontend code. Production authorization must run again at every server page, action, API, data repository, and integration boundary.

## Corporate modules

- **Dashboard:** organization priorities, production context, training, quality alerts, and recent activity.
- **Roast profiles:** local create, edit, duplicate, compare, approve/archive, revision, and curve visualization workflows.
- **Roast simulator:** educational telemetry and event logging with an explicit “no equipment is being controlled” safety state.
- **Recipe manager:** versioned café and production recipe records with assignment, approval, search, and filters.
- **Quality control:** cupping, batch, brew-check, deviation, and corrective-action signals.
- **Corporate troubleshooting:** contextual, non-certain diagnosis that changes one primary variable at a time.
- **Learning and standards:** roasting curricula, checklists, knowledge checks, and operational references.
- **Equipment and integrations:** mock/read-only/planned capability disclosure and future adapter boundaries.
- **Team and locations:** training, certification, equipment, recipe, calibration, and issue context.

## Data architecture

Domain models live in `src/types`. The barrel in `src/data` exports the read-only local knowledge base. Presentation components consume those exports, while recipe generation and troubleshooting remain pure functions in `src/lib`.

This boundary supports a later migration in which server-fetched records implement the same interfaces. UI components should not need to know whether their data came from a local file, a database, or a retrieval service.

Recipe output is intentionally described as a recommended starting point. Real settings vary with grinder calibration, burr wear, bean density, roast level, coffee age, water, and brewing technique.

## Adding a coffee origin

1. Add the origin identifier to `OriginId` in `src/types/domain.ts`.
2. Add one `CoffeeOrigin` record in `src/data/origins.ts`.
3. Add or update representative beans in `src/data/beans.ts`.
4. Reference the new origin from relevant methods, lessons, or recipes.
5. Run `pnpm typecheck` and `pnpm test`.

The explorer reads the shared data automatically; avoid adding a duplicate list inside a page component.

## Adding a brewing method

1. Add the identifier to `BrewMethodId`.
2. Add a complete `BrewingMethod` record in `src/data/brewing-methods.ts`, including steps, mistakes, troubleshooting, a video placeholder, and related content.
3. Add starting guidance for each supported grinder in `src/data/grinders.ts`.
4. Extend the method defaults in `src/lib/recipe.ts`.
5. Add targeted recipe tests and verify the generated static route.

The method overview and dynamic detail route are data-driven.

## Adding a grinder

1. Add the identifier to `GrinderId`.
2. Add a complete `Grinder` record in `src/data/grinders.ts`.
3. Include one `GrinderSetting` for each applicable brew method.
4. Add calibration, zero-point, cleaning, and common-error guidance.
5. Add the grinder to the Brew Lab selector and test at least one calculation.

Settings should be conservative starting ranges. Do not present a click or dial number as universally exact.

## Replacing video placeholders

Video records belong to their associated method or grinder in the data layer. Replace the placeholder thumbnail, duration, title, description, captions state, and chapter list there. The UI deliberately does not autoplay or embed third-party copyrighted media.

When a licensed video platform is connected later, keep a poster image and text fallback, provide captions or a transcript, lazy-load the player, and preserve the current aspect ratio to avoid layout shift.

## Adding a roasting-machine adapter

1. Read the vendor’s official documentation and obtain explicit authorization for the intended connection mode.
2. Implement the adapter contract in `src/lib/integrations/roasters`; do not call vendor code from UI components.
3. Start read-only. Declare telemetry fields, stale-data behavior, connection health, and unsupported values explicitly.
4. Register the adapter through the roaster registry and add contract, failure, and stale-telemetry tests.
5. Document authentication, protocol, network or gateway setup, permissions, audit events, and manual fallback.
6. Do not enable commands for heat-producing equipment without machine-specific safety validation, fail-safe behavior, and explicit human confirmation.

## Adding a corporate recipe type

1. Extend the corporate recipe-category union in the corporate domain types.
2. Add category-specific optional fields and validation in the recipe validation module.
3. Add a typed mock example without duplicating it in a page component.
4. Update filters and the edit form while keeping common fields shared.
5. Add validation tests and verify version and approval behavior.

## Adding a roasting lesson

1. Add the lesson to the corporate learning data with objectives, difficulty, duration, written content, visualization metadata, video placeholder, knowledge check, and checklist.
2. Assign it to the correct learning track.
3. Include machine, batch, coffee, environmental, technique, and sensor caveats where relevant.
4. Render it through the shared learning components and verify keyboard access.
5. Record content owner, provenance, and review date before treating it as production curriculum.

## Replacing mock data with APIs

Preserve the domain interfaces and introduce server-only repositories for organizations, profiles, recipes, quality records, learning, and integrations. Validate every request and response, scope every query to the authenticated tenant, and keep UI components unaware of the storage provider. Replace local mutations with server actions or APIs only after authentication, authorization, tenancy, audit, and concurrency behavior are defined.

## Future backend integration

A backend can be introduced behind typed repository functions without changing route-level presentation components. Likely boundaries include:

- authenticated profile and equipment preferences
- cloud-synced journal entries and saved recipes
- versioned coffee, grinder, and educational content
- verified retrieval for personalized recommendations
- analytics events for completed lessons and brew sessions
- optional scale telemetry ingestion

Server actions or route handlers should validate inputs at the boundary. Recommendation responses should retain the current caveats and expose the variables used to produce each suggestion.

### Production security requirements

A production deployment must add:

- server-side authentication and securely hashed passwords;
- secrets and provider credentials in protected environment variables;
- server-side role and permission authorization;
- protected, validated APIs and server actions;
- database row-level security as defense in depth;
- immutable audit logs for approvals, access, exports, and equipment actions;
- session expiration, rotation, and revocation;
- login and API rate limiting;
- secure account recovery;
- multi-factor authentication for corporate accounts;
- tenant isolation between organizations and automated isolation tests.

Supabase Auth, Auth.js, Clerk, or another reviewed provider can replace the demo login. Passwords must never be stored in frontend source in a real deployment.

See [docs/CORPORATE_PLATFORM.md](docs/CORPORATE_PLATFORM.md) for the business product and integration model, and [docs/PRODUCT_ROADMAP.md](docs/PRODUCT_ROADMAP.md) for proposed phases.
