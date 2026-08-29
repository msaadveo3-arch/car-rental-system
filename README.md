# Car Rental System

**Documentation version:** 1.0.0

**Last verified:** 2026-08-29

**Runtime:** PHP 8.4, Symfony 8.1, MySQL 8, React 18, TypeScript, Vite 5, Tailwind CSS 3, DaisyUI 4

> **AI and contributor reading instruction:** Read this file for project context, then read [`AGENTS.md`](./AGENTS.md) before changing code. Treat `[SPEC]` statements as requirements, `[NOTE]` as context, `[BUG]` as a known failure with a verified remedy, and `[?]` as an unresolved point that must be checked before relying on it.

## Project overview

[SPEC] This repository is a local-first car-rental management application with a React single-page frontend and a lightweight Symfony JSON API. It covers authentication, customers, fleet vehicles, configurable lookups, rental-contract creation, pickup inspections, rentals, tariffs, kilometre policies, border fees, dashboards, and reports.

The development topology is:

```text
Browser http://127.0.0.1:5173
  -> React/Vite frontend
  -> /api proxy
  -> Symfony API http://127.0.0.1:8000
  -> Doctrine ORM/DBAL
  -> MySQL car_rental_db
```

[SPEC] The browser must call relative `/api/...` URLs. Vite proxies those requests to Symfony during development, so frontend code must not hard-code the backend origin.

## Repository map

```text
car-rental-system/
├── AGENTS.md                         Project implementation rules
├── README.md                         Setup, architecture, and operations guide
├── start.sh                          Installs missing dependencies and starts both apps
├── backend/
│   ├── bin/                          Symfony console and PHPUnit entry points
│   ├── config/                       Framework, Doctrine, security, CORS, routes, services
│   ├── migrations/car_rental_db.sql  Single clean-install schema and seed-data baseline
│   ├── public/index.php              API front controller
│   ├── src/
│   │   ├── Controller/               Attribute-routed JSON API controllers
│   │   ├── Entity/                   Doctrine ORM entities
│   │   ├── EventSubscriber/          Consistent API exception responses
│   │   ├── Exception/                API-domain exceptions
│   │   ├── Repository/               ORM and DBAL QueryBuilder persistence
│   │   └── Security/                 Opaque bearer-token authentication
│   └── tests/                        PHPUnit security and route tests
└── frontend/
    ├── src/
    │   ├── components/               Common, layout, booking, customer, lookup, and UI components
    │   ├── context/                  Authentication and theme state
    │   ├── hooks/                    Shared React hooks
    │   ├── pages/                    Route-level screens
    │   ├── services/                 Axios API adapters
    │   ├── types/                    TypeScript domain and transport types
    │   ├── App.tsx                   Client route registration
    │   └── index.css                 DaisyUI-aware shared visual conventions
    ├── tailwind.config.js            DaisyUI with light and dark themes
    └── vite.config.ts                Port 5173 and /api proxy configuration
```

## Technology and conventions

### Backend

- PHP `>=8.4` and Symfony `8.1.*`.
- API-only framework packages; there is no Twig/server-rendered UI.
- Doctrine ORM `^3.6` for mapped entities and entity repositories.
- Doctrine DBAL QueryBuilder for joined API projections and controlled dynamic lookup tables.
- Doctrine Migrations Bundle is installed; the repository currently keeps one SQL baseline at `backend/migrations/car_rental_db.sql` for a clean database import.
- Symfony Security with a stateless custom bearer-token authenticator.
- Symfony Validator, Serializer, Rate Limiter, UID, Console, and Nelmio CORS.
- PHPUnit 13, BrowserKit, and CSS Selector for backend tests.

### Frontend

- React 18 with functional TypeScript components and React Router 6.
- Axios for API traffic; the shared client automatically attaches the bearer token.
- Tailwind CSS 3 and DaisyUI 4 for the design system.
- DaisyUI themes: `light` and `dark`; `light` is the default.
- Theme persistence key: `car-rental-theme` in `localStorage`.
- Authentication persistence keys: `auth_token` and `auth_user` in `localStorage`.
- `react-select` through the shared `AppSelect` component.
- `react-day-picker` through the shared `AppDatePicker` component.
- Lucide React icons and jsPDF report output.

## Prerequisites

[SPEC] Install these tools before launching the project:

- PHP 8.4 with the extensions required by Symfony, Doctrine, and MySQL.
- Composer 2.
- MySQL 8.x; the Doctrine configuration currently declares server version `8.0.30`.
- Node.js and npm. A current Node.js LTS release is recommended.
- `lsof` is recommended because `start.sh` uses it to detect occupied ports.

Verify the main tools:

```bash
php -v
composer --version
mysql --version
node --version
npm --version
```

If Homebrew has several PHP versions installed, activate PHP 8.4 before Composer or Symfony commands:

```bash
brew unlink php
brew link --overwrite --force php@8.4
php -v
```

## Database setup

[SPEC] The local database name is `car_rental_db`. The one-file baseline is [`backend/migrations/car_rental_db.sql`](./backend/migrations/car_rental_db.sql).

Create and import it:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS car_rental_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p car_rental_db < backend/migrations/car_rental_db.sql
```

Create `backend/.env.local` for machine-specific credentials. Do not commit it:

```dotenv
DATABASE_URL="mysql://root:YOUR_URL_ENCODED_PASSWORD@127.0.0.1:3306/car_rental_db?serverVersion=8.0.30&charset=utf8mb4"
```

[NOTE] If the database password contains reserved URL characters, URL-encode it in `DATABASE_URL`.

Validate connectivity and mappings after the import:

```bash
cd backend
php bin/console doctrine:query:sql "SELECT 1"
php bin/console doctrine:schema:validate
```

[SPEC] Never store a plaintext application password in the `users.password` column. Passwords must be generated through Symfony's configured password hasher. Never put real database or user passwords in committed documentation, fixtures, scripts, or environment files.

## Launch locally

### Recommended: one command

From the repository root:

```bash
./start.sh
```

The launcher:

1. Checks PHP, Composer, Node.js, and npm.
2. Runs `composer install` when `backend/vendor` is missing.
3. Runs `npm install` when `frontend/node_modules` is missing.
4. Refuses to start if ports 8000 or 5173 are already occupied.
5. Starts the Symfony API and Vite frontend.
6. Opens `http://127.0.0.1:5173` in the default browser.
7. Stops both child servers when you press `Ctrl+C`.

Force both dependency installers even when dependency directories already exist:

```bash
./start.sh --build
```

[NOTE] In this launcher, `--build` means “force dependency reinstall/check before startup”; it does not run a production bundle build.

### Manual launch

Terminal 1:

```bash
cd backend
composer install
php -S 127.0.0.1:8000 -t public public/index.php
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. The API is available at `http://127.0.0.1:8000`, but most `/api` routes require authentication.

## Authentication and security

[SPEC] Authentication is stateless and uses an opaque bearer token:

1. `POST /api/auth/login` accepts `username` or `email` plus `password`.
2. Symfony verifies the password with `UserPasswordHasherInterface`.
3. A random raw token is returned once to the frontend.
4. Only its SHA-256 hash is stored in `api_tokens` with a one-day expiry.
5. Axios sends the raw value as `Authorization: Bearer <token>`.
6. Logout deletes the stored token hash.

Only `/api/auth/login` is public. All other `/api` endpoints require `ROLE_USER`. User roles also produce `ROLE_ADMIN`, `ROLE_STAFF`, or `ROLE_INSPECTOR` through the `User` entity.

[NOTE] The sidebar filters navigation by role. That is a user-interface convenience, not an authorization boundary. Sensitive operations must also be protected in Symfony security or controller authorization rules.

Login is rate-limited. API authentication failures use:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## API response contract

[SPEC] Successful collection and resource endpoints normally return:

```json
{
  "success": true,
  "data": {}
}
```

Auth endpoints return `token` and/or `user` beside `success`. Errors return:

```json
{
  "success": false,
  "message": "Human-readable message"
}
```

Use the established status codes:

- `200 OK` for successful reads, updates, deletes, login, and logout.
- `201 Created` for successful creates.
- `401 Unauthorized` for missing, invalid, or expired authentication.
- `403 Forbidden` for authenticated users without permission.
- `404 Not Found` for missing resources or unsupported lookup types.
- `409 Conflict` for unique-key or in-use resource conflicts.
- `422 Unprocessable Entity` for input validation failures.
- `429 Too Many Requests` for login throttling.
- `500 Internal Server Error` for unexpected server failures; internal exception details are logged, not exposed.

## API routes

All paths below are prefixed by the same host and require a bearer token except login.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Authenticate and create an API token |
| POST | `/api/auth/logout` | Revoke the current token |
| GET | `/api/auth/me` | Read the current user |
| GET, POST | `/api/customers` | List or create customers |
| PUT, DELETE | `/api/customers/{id}` | Update or delete a customer |
| GET, POST | `/api/cars` | List or create fleet cars |
| PUT, DELETE | `/api/cars/{id}` | Update or delete a car |
| GET | `/api/car-models` | List car-model data for fleet forms |
| GET | `/api/lookups` | Read the fleet-form lookup bundle |
| GET, POST | `/api/lookups/{type}` | List or create a generic lookup value |
| PUT, DELETE | `/api/lookups/{type}/{id}` | Update or delete a lookup value |
| GET, POST | `/api/border-fees` | List or create border fees |
| PUT, DELETE | `/api/border-fees/{id}` | Update or delete a border fee |
| GET, POST | `/api/km-policies` | List or create kilometre policies |
| PUT, DELETE | `/api/km-policies/{id}` | Update or delete a kilometre policy |
| GET, POST | `/api/tariffs` | List or create tariffs |
| PUT, DELETE | `/api/tariffs/{id}` | Update or delete a tariff |
| GET, POST | `/api/tariff-details` | List or create tariff details |
| PUT, DELETE | `/api/tariff-details/{id}` | Update or delete a tariff detail |
| GET, POST | `/api/rentals` | List or create rental contracts |
| GET, PUT | `/api/rentals/{id}` | Read or update a rental contract |
| GET, POST | `/api/inspections/pickup` | List pickup inspections or submit one |

Run `cd backend && php bin/console debug:router --show-controllers` for the live authoritative route list.

### Generic lookup types

Supported `{type}` values are:

```text
body_types, fuel_types, transmissions, car_groups, branches, sources,
borders, payment_methods, currencies, vehicle_makes, vehicle_models,
engine_capacities, technical_statuses, colors, customer_types,
license_types, pricing_modes, rental_types
```

Deletion is rejected when the lookup is referenced by another record.

## Database domain

The current baseline contains these table groups:

- Security: `users`, `api_tokens`.
- Customers: `customers`, `customer_types`, `license_types`.
- Fleet: `cars`, `car_models`, `vehicle_makes`, `vehicle_models`, `car_groups`, `body_types`, `fuel_types`, `transmissions`, `engine_capacities`, `technical_statuses`, `colors`.
- Rentals: `rentals`, `rental_types`, `branches`, `sources`, `payment_methods`, `currencies`.
- Pricing: `tariffs`, `tariff_details`, `pricing_modes`, `km_policies`, `borders`, `border_fees`.
- Operations: `inspections`.

[SPEC] Database reads and writes belong in repositories and must use Doctrine ORM QueryBuilder or Doctrine DBAL QueryBuilder with bound parameters. Controllers must not contain SQL, and entities must not query the database.

## Frontend routes and features

| Route | Screen |
|---|---|
| `/login` | Sign in |
| `/` | Dashboard summary, latest contracts, and fleet status |
| `/customers` | Customer list and management |
| `/customers/add` | Create customer |
| `/customers/edit/:id` | Edit customer |
| `/cars` | Fleet list and management |
| `/cars/add` | Create car |
| `/cars/edit/:id` | Edit car |
| `/lookups` | Lookup, tariff, border-fee, and KM-policy management |
| `/booking` | Nine-step rental contract wizard |
| `/rentals` | Rental list |
| `/rentals/:id` | Rental details |
| `/inspection-queue` | Inspector work queue |
| `/inspection-view/:id` | Pickup inspection view |
| `/reports` | Operational reports and PDF export |

The booking wizard uses a vertical DaisyUI stepper with one content step mounted at a time. Customer, deposit, vehicle, booking information, and tariff selection are implemented. Accessories, additional drivers, advanced payments, and legal-documentation sections currently contain placeholders before final contract confirmation.

## Frontend design system

[SPEC] `light` is the default DaisyUI theme and `dark` is the alternate theme. Components must use semantic DaisyUI tokens such as `base-100`, `base-200`, `base-300`, `base-content`, `primary`, `success`, `warning`, and `error`; do not hard-code light-only white, black, or gray colors.

Shared primitives include:

- `AppSelect`: the only project-standard single-select control; wraps `react-select` and maps DaisyUI OKLCH tokens.
- `AppDatePicker`: the standard date field/calendar; wraps `react-day-picker`.
- `Modal`: the shared card-based overlay.
- `DashboardLayout`: the full-height shell with sidebar and top bar.
- `.app-page`: the standard page-content spacing container.
- `.app-card`: `card card-border bg-base-100 shadow-sm` surface.
- `.app-table`: DaisyUI `table table-zebra` styling.
- `.app-field`, `.app-textarea`, `.app-label`: consistent form controls.
- DaisyUI `btn`, `badge`, `alert`, `toggle`, `card`, and `table` classes for their respective controls.

[NOTE] DaisyUI 4 color variables are OKLCH component values. In custom JavaScript styles use `oklch(var(--b1))`, `oklch(var(--b3))`, `oklch(var(--bc))`, and equivalent semantic tokens. Wrapping them in `hsl(...)` produces incorrect colors, including black borders.

## Development commands

### Backend

```bash
cd backend
composer install
php bin/console about
php bin/console debug:router --show-controllers
php bin/console doctrine:schema:validate
php bin/phpunit
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run preview
```

[NOTE] There is currently no frontend test script. A successful production build is the minimum automated frontend validation.

## Troubleshooting

### Vite says port 5173 is already in use

[BUG] Symptom: `Error: Port 5173 is already in use`. Cause: Vite is configured with `strictPort: true`, so it will not silently choose another port. Fix:

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN
kill <PID>
./start.sh
```

Use `kill -9` only as a last resort after a normal termination fails.

### The browser returns `POST /api/auth/login Not Found`

[BUG] Symptom: login through `http://127.0.0.1:5173/api/auth/login` returns `Not Found`. Cause: the Symfony API is not running, the Vite proxy is not active, or the frontend was opened without the development server. Fix: launch both services with `./start.sh`, then confirm `php bin/console debug:router` includes `/api/auth/login`.

### Composer reports an unsupported PHP version

[BUG] Symptom: Composer refuses to install Symfony packages. Cause: the active shell is using PHP older than 8.4. Fix: activate Homebrew PHP 8.4, reopen or rehash the shell if necessary, and verify with `php -v` before rerunning Composer.

### API returns 401 after a previous login

[NOTE] API tokens expire after one day and can also be revoked by logout. Clear `auth_token` and `auth_user`, then sign in again.

### Database connection fails

Check that MySQL is running, `car_rental_db` exists, the SQL baseline was imported, and `backend/.env.local` has a correctly URL-encoded `DATABASE_URL`.

## Current limitations

- The advanced booking steps named above are placeholder UI rather than complete business workflows.
- Frontend automated tests are not configured.
- Vite may warn that the production JavaScript chunk exceeds 500 kB; the build can still succeed, but future work may introduce route-level splitting.
- LocalStorage is used for the bearer token. Any production deployment should review the threat model, transport security, token lifetime, CSP, and storage choice.

## Contribution contract

[SPEC] All future code must follow [`AGENTS.md`](./AGENTS.md). That file defines how to add entities, repositories, controllers, database changes, API services, pages, forms, selects, calendars, modals, tables, themes, authorization, tests, and verification without breaking the established project patterns.
