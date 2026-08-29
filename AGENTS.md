# Car Rental System Agent Rules

**Rules version:** 1.0.0

**Last verified:** 2026-08-29

**Scope:** This directory and every descendant unless a more specific `AGENTS.md` overrides a section.

> **Agent reading instruction:** Read this file completely before editing the repository. Read `README.md` for current setup and architecture. Treat every `[SPEC]` statement as mandatory, `[NOTE]` as context, `[BUG]` as a verified failure pattern, and `[?]` as something that must be verified before implementation.

## 1. Objective and priorities

[SPEC] Preserve the established Symfony/Doctrine and React/DaisyUI architecture. Future work must match existing patterns before introducing new abstractions.

When instructions compete, apply this order:

1. The user's current explicit request.
2. Safety, security, data integrity, and repository-local rules.
3. Existing public API and database compatibility.
4. This project contract.
5. Nearby code conventions.

[SPEC] Do not rewrite unrelated code, discard user changes, reset the worktree, change credentials, mutate production-like data, or perform destructive database/Git operations unless the user explicitly requests it.

## 2. Required workflow

For every implementation:

1. Inspect `git status --short` and preserve unrelated changes.
2. Find the nearest existing implementation of the same kind.
3. Trace the full path affected: schema -> entity -> repository -> controller -> API client -> component/page -> verification.
4. Make the smallest cohesive change that solves the request.
5. Reuse existing components and utilities before creating a new one.
6. Validate in proportion to risk using the commands in section 15.
7. Report files changed, behavior delivered, and any verification that could not run.

[SPEC] Never guess a table column, relation, route, response shape, role, status value, or shared component API. Read its current definition first.

## 3. Architecture boundaries

```text
React page/component
  -> frontend service (Axios /api URL)
  -> Symfony controller (HTTP and validation)
  -> repository (Doctrine ORM or DBAL QueryBuilder)
  -> entity/database
```

[SPEC] Responsibilities:

- React pages orchestrate screen state, routing, and domain components.
- Reusable React components own reusable presentation and focused interactions.
- Frontend services own HTTP calls and response typing.
- Symfony controllers own routing, request parsing, authorization checks, response codes, and API envelopes.
- Repositories own persistence and query composition.
- Entities own mapped state and simple domain behavior; they do not query services or the database.
- The SQL baseline owns the clean-install schema and seed data.

Do not place SQL in controllers, Axios calls inside generic UI primitives, database calls in entities, or page-specific business behavior in global CSS.

## 4. Backend platform rules

[SPEC] Backend code targets PHP 8.4 and Symfony 8.1. Use strict, typed PHP and Symfony dependency injection. Do not introduce a second framework, an alternate ORM, Active Record, or a server-rendered frontend.

Backend placement:

| Concern | Location |
|---|---|
| HTTP endpoint | `backend/src/Controller/*Controller.php` |
| Doctrine entity | `backend/src/Entity/*.php` |
| Entity query/persistence | `backend/src/Repository/*Repository.php` |
| Joined API projection | `backend/src/Repository/*ApiRepository.php` |
| Cross-endpoint business workflow | `backend/src/Service/*.php` when needed |
| Authentication | `backend/src/Security/` |
| API exception conversion | `backend/src/EventSubscriber/` |
| Schema and baseline data | `backend/migrations/car_rental_db.sql` |
| Tests | `backend/tests/` mirroring the source concern |

[SPEC] Classes should be `final` unless the framework or a documented extension point requires inheritance. Prefer constructor injection with `private readonly` dependencies. Services are autowired and autoconfigured under the `App\` namespace.

## 5. Creating or changing a Doctrine entity

Before editing an entity, inspect the matching SQL table and existing entity/repository.

[SPEC] Entity checklist:

- Use a singular PascalCase class name in `App\Entity`.
- Add `#[ORM\Entity(repositoryClass: ...::class)]`.
- Add `#[ORM\Table(name: '...')]` when the inferred name is not the exact database table.
- Use PHP attributes, never YAML/XML mappings.
- Use typed properties; nullable database columns must have nullable PHP types.
- Match column name, length, precision, scale, unsigned behavior, default, and nullability to the SQL schema.
- Use `#[ORM\Id]` and `#[ORM\GeneratedValue]` for auto-increment identifiers.
- Map foreign keys as Doctrine associations when the project already treats the referenced table as an entity.
- The owning side holds `#[ORM\JoinColumn(...)]`; make the property nullable only when the join is nullable.
- Initialize collection associations in the constructor and expose `add*`/`remove*` methods that keep both sides consistent.
- Keep getters/setters typed. Existing fluent setters return `self`; match that convention.
- Use `\DateTimeInterface` consistently with the mapped Doctrine date/time type.
- Implement security interfaces only on security-domain entities such as `User`.
- Do not expose password hashes, token hashes, or internal associations in API payloads.

Minimal pattern:

```php
#[ORM\Entity(repositoryClass: ExampleRepository::class)]
#[ORM\Table(name: 'examples')]
final class Example
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 120)]
    private string $name;

    public function getId(): ?int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }
}
```

[SPEC] A mapped entity change is incomplete until the SQL baseline/schema strategy, repository behavior, API payloads, and tests are considered.

## 6. Creating a repository and using QueryBuilder

### Entity repositories

[SPEC] A repository for a mapped entity extends `ServiceEntityRepository`, receives `ManagerRegistry`, and declares the entity class in `parent::__construct`.

```php
final class ExampleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Example::class);
    }

    public function queryAll(string $alias = 'e'): QueryBuilder
    {
        return $this->createQueryBuilder($alias)
            ->orderBy($alias.'.id', 'ASC');
    }

    public function queryActive(string $alias = 'e'): QueryBuilder
    {
        return $this->queryAll($alias)
            ->andWhere($alias.'.status = :status')
            ->setParameter('status', 'active');
    }
}
```

Return a `QueryBuilder` for reusable composition. A clearly named terminal method may return an entity, list, scalar, or DTO/array when composition is not needed.

### API projection repositories

[SPEC] Use a focused `*ApiRepository` with Doctrine DBAL `Connection::createQueryBuilder()` for multi-table projections, aggregate dashboards, controlled bulk operations, or writes that do not map cleanly to one entity aggregate. Existing examples include `CustomerApiRepository`, `FleetApiRepository`, `PricingApiRepository`, and `RentalApiRepository`.

[SPEC] Query rules:

- Bind every runtime value with `setParameter`; never interpolate user input.
- Select explicit columns and stable aliases for API projections.
- Use deterministic ordering.
- Avoid N+1 queries; join or batch related data.
- Paginate unbounded lists.
- Wrap multi-write workflows in a transaction.
- Catch known constraint exceptions at the HTTP boundary and return `409` or `422` as appropriate.
- Dynamic table/column names are allowed only from a closed server-owned whitelist, as in `LookupRepository::DEFINITIONS`; never accept arbitrary identifiers from a request.
- Put query intent in method names such as `findForList`, `findDetails`, `queryActive`, or `createRental`.
- Add an index in the schema when a new frequently filtered/joined field needs one.

## 7. Creating a controller or endpoint

[SPEC] Controllers are final classes extending `AbstractController`, use Symfony route attributes, return typed `JsonResponse`, and receive repositories/services through the constructor.

```php
#[Route('/api/examples')]
final class ExampleController extends AbstractController
{
    public function __construct(private readonly ExampleRepository $examples) {}

    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $rows = $this->examples->queryAll()->getQuery()->getResult();

        return $this->json(['success' => true, 'data' => $rows]);
    }
}
```

[SPEC] Endpoint workflow:

1. Declare a class-level `/api/...` prefix and method-level route.
2. Parse JSON with `$request->toArray()`.
3. Normalize strings and convert scalar types deliberately.
4. Validate required data before persistence. Use Symfony Validator for reusable/complex rules and focused private validation only for simple local cases.
5. Resolve authenticated users with `$this->getUser()` and verify the concrete `User` type.
6. Call a repository or service; keep query construction out of the controller.
7. Return an explicit payload and correct status code.
8. Convert expected unique/foreign-key/domain failures to safe client messages.
9. Let unexpected failures reach `ApiExceptionSubscriber`, which logs details and returns a generic 500.

[SPEC] Response envelopes:

```php
return $this->json(['success' => true, 'data' => $payload]);
return $this->json(['success' => false, 'message' => $message], $status);
```

Auth endpoints may return `token` and `user` beside `success`. Use `201` for creates, `422` for invalid input, `404` for missing data, `409` for conflicts, `401` for unauthenticated requests, and `403` for forbidden actions.

[SPEC] Build explicit API arrays or DTOs. Do not serialize whole Doctrine entities blindly; that risks circular references, lazy-loading surprises, and leaking internal fields. Format dates consistently and keep request/response keys in the existing `snake_case` API convention.

After adding a route, run `php bin/console debug:router --show-controllers` and add a route/security/controller test.

## 8. Authentication and authorization

[SPEC] Keep the current stateless opaque-token design unless the user explicitly requests an authentication redesign.

- Login accepts username or email and verifies with `UserPasswordHasherInterface`.
- Generate raw tokens with cryptographically secure randomness.
- Store only the SHA-256 token hash in `api_tokens`.
- Tokens expire and logout removes the stored token.
- Never log raw tokens, passwords, or database credentials.
- Never manually invent a password hash. Use Symfony's configured hasher.
- `/api/auth/login` is public; other `/api` routes require `ROLE_USER` by default.
- Add server-side role checks for restricted operations. Sidebar visibility alone is never authorization.
- Preserve login rate limiting and safe generic credential failures.

## 9. Database and migration rules

[SPEC] MySQL `car_rental_db` is the database. `backend/migrations/car_rental_db.sql` is the current single clean-install schema and seed baseline. Do not create a parallel `database/`, `db/`, `sql/`, or second schema dump.

For a schema change:

1. Inspect the existing table, keys, constraints, and mapped entity.
2. Update the entity mapping and the single SQL baseline in the same change.
3. Preserve existing data semantics, names, foreign keys, indexes, audit columns, and status conventions.
4. Add or change repository/controller/frontend code as needed.
5. Test the SQL against a disposable database when practical.
6. Run `doctrine:schema:validate` against the resulting schema.

[NOTE] Doctrine Migrations Bundle is installed, but the checked-in database source is currently the one SQL baseline rather than a chain of generated `Version*.php` files. Do not start a second migration strategy silently. If the user requests incremental Doctrine migrations, document the transition and keep clean-install behavior unambiguous.

[SPEC] Schema rules:

- Use `utf8mb4`.
- Every foreign key must have a deliberate delete/update action.
- Add indexes for foreign keys and common query predicates.
- Keep monetary precision in `DECIMAL`; do not use binary floating point for persisted money.
- Use explicit status values consistent with the current tables and API.
- Keep `created_at`, `updated_at`, `created_by`, and `updated_by` where the surrounding table family uses them.
- Seed reference data only when a clean install requires it.
- Never commit live exports, secrets, plaintext user passwords, or machine-specific data.

## 10. Frontend platform and file placement

[SPEC] Use React functional components and TypeScript. Do not introduce class components, a second state framework, another CSS framework, or another component library without explicit approval.

| Concern | Location |
|---|---|
| Route screen | `frontend/src/pages/` |
| Shared generic control | `frontend/src/components/common/` |
| Layout shell | `frontend/src/components/layout/` |
| Domain component | `frontend/src/components/<domain>/` |
| HTTP adapter | `frontend/src/services/` |
| Shared domain/transport type | `frontend/src/types/` |
| Shared state | `frontend/src/context/` and `frontend/src/hooks/` |
| Global design utilities | `frontend/src/index.css` |

[SPEC] Register route-level screens in `App.tsx`. Use `DashboardLayout` for authenticated application screens and `.app-page` for the standard content spacing. Do not create page-specific outer padding that conflicts with the common layout.

## 11. API integration and frontend state

[SPEC] Use the shared Axios instance from `frontend/src/services/api.ts`:

- Call relative paths such as `/customers`, because the client already has `baseURL: '/api'`.
- Never hard-code `http://127.0.0.1:8000` in a component or service.
- Let the interceptor attach `Authorization: Bearer ...`.
- Put repeatable endpoint calls in a named service module.
- Type request payloads and returned data; avoid `any` in new code.
- Follow the backend envelope: most resource data is `response.data.data`; auth uses `response.data.user` and `response.data.token`.
- Keep transport keys in `snake_case`; adapt them deliberately when component state uses camelCase.
- Show loading, empty, success, validation, and server-error states.
- Cancel or ignore stale asynchronous results when rapid input/navigation can race.

[SPEC] Authentication continues to use `AuthContext` and localStorage keys `auth_token` and `auth_user`. Theme state continues to use `ThemeContext` and `car-rental-theme`.

## 12. React component rules

[SPEC] Prefer composition and controlled components:

- Props describe meaning, not arbitrary styling switches.
- A controlled field receives `value` and `onChange`.
- Keep local state only for internal interaction state such as an open dropdown.
- Lift shared workflow state to the nearest common owner.
- Extract a component when it is reused or when it isolates a coherent domain interaction.
- Do not create a wrapper that merely renames one HTML element without enforcing a project convention.
- Preserve keyboard operation, focus visibility, labels, disabled state, and semantic HTML.
- Use Lucide icons and mark decorative icons with `aria-hidden`.

### Select inputs

[SPEC] Every ordinary single-select input uses `components/common/AppSelect.tsx`, not native `<select>` and not direct `react-select` usage. Provide options as `{ value, label }`, a scalar `value`, and `onChange(value)`.

```tsx
<AppSelect
  value={form.branch_id}
  onChange={(branchId) => setForm((current) => ({ ...current, branch_id: branchId }))}
  options={branches.map((branch) => ({ value: branch.id, label: branch.name }))}
  aria-label="Pickup branch"
/>
```

Extend `AppSelect` itself if every select needs a new behavior. Keep its DaisyUI token styling, portal menu, fixed positioning, `sm`/`md` sizing, focus state, and accessible name.

### Date inputs

[SPEC] Every date-only picker uses `components/common/AppDatePicker.tsx`. Store controlled values as `YYYY-MM-DD`; display formatting belongs in the shared component. Do not use a browser-native date popup or instantiate `react-day-picker` directly on a page.

### Modals

[SPEC] Reuse `components/common/Modal.tsx` for standard overlays:

```tsx
<Modal open={isOpen} title="Edit customer" onClose={closeModal}>
  <CustomerForm />
</Modal>
```

Modal rules:

- The parent owns `open` and domain state.
- Close on the provided control; add Escape/backdrop behavior to the shared component if it becomes a global requirement.
- Use a DaisyUI card/card-border surface with `bg-base-100`, `border-base-300`, and semantic text.
- Keep actions inside a consistent bottom row with DaisyUI buttons.
- Use a unique visible title and accessible dialog labeling.
- Trap/restore focus before using a modal for sensitive or production-critical workflows; improve the shared primitive rather than implementing focus behavior per page.
- Do not duplicate a page title as an inner card title. If the page already provides the content surface, mount the form content directly into that parent.

### Tables, badges, alerts, and buttons

[SPEC]

- Tables use `table table-zebra` or `.app-table` inside `overflow-x-auto`.
- Use semantic table headers and stable row keys.
- Status indicators use soft semantic DaisyUI badges (`badge-success`, `badge-warning`, `badge-error`, `badge-info`, `badge-neutral`) through the project overrides; do not hand-tune height/padding per page.
- Alerts use DaisyUI `alert` with a semantic variant.
- Buttons use `btn` plus one intentional size and semantic variant. Use `btn-primary` for the main action, `btn-ghost` for low emphasis, and `btn-error` for destructive confirmation.
- Icon-only buttons require an `aria-label` and tooltip/title where helpful.
- Disable submit buttons during mutations and show a loading label or spinner.

## 13. DaisyUI theme and layout rules

[SPEC] Supported themes are exactly `light` and `dark`, with `light` as the default. New UI must work in both before completion.

Use semantic tokens:

| Purpose | Preferred class/token |
|---|---|
| Page/body background | `bg-base-100` or established layout background |
| Raised/alternate area | `bg-base-200` |
| Border/divider | `border-base-300` |
| Main text | `text-base-content` |
| Secondary text | `text-base-content/60` or `/70` |
| Muted text | `text-base-content/50` |
| Primary action | `primary` / `primary-content` |
| Positive status | `success` / `success-content` |
| Warning status | `warning` / `warning-content` |
| Error status | `error` / `error-content` |

[SPEC] Do not use fixed `bg-white`, `text-black`, arbitrary gray palettes, or white borders for themed surfaces. Do not add broad CSS selectors that overwrite DaisyUI component borders, shadows, radii, heights, or typography.

When JavaScript styling is unavoidable, DaisyUI 4 variables are OKLCH components:

```ts
backgroundColor: 'oklch(var(--b1))'
borderColor: 'oklch(var(--b3))'
color: 'oklch(var(--bc))'
```

[BUG] Do not wrap DaisyUI 4 variables in `hsl(...)`; this previously produced black `react-select` borders and mismatched theme colors.

[SPEC] Component geometry:

- Standard controls use DaisyUI's normal size; current shared input/select/date height is 3rem (`h-12`).
- Controls use `rounded-btn`.
- Cards and menus use `rounded-box`.
- Cards use `card card-border bg-base-100 shadow-sm` or `.app-card`.
- Do not remove the visible `base-300` card/control border in the light theme.
- Avoid nested bordered cards when one parent surface is enough.
- Use responsive CSS Grid/Flex. Stack on narrow screens and use the requested ratios at desktop breakpoints.
- Keep full-height layout behavior in `DashboardLayout`; local pages must not create competing viewport scroll containers unless the workflow explicitly requires one.

For the rental-contract wizard, preserve the current pattern: a vertical DaisyUI stepper, one corresponding content step mounted at a time, sticky step navigation, a scrollable right content pane, and sticky Back/Next actions at the bottom.

## 14. Creating a frontend page or feature

Use this sequence:

1. Define or update the transport/domain types.
2. Add a focused service method using the shared Axios client.
3. Create reusable domain components for complex forms/pickers.
4. Create the route page in `pages/`.
5. Wrap authenticated pages in `DashboardLayout` and `.app-page`.
6. Register the route in `App.tsx`.
7. Add role-aware navigation only when appropriate, and add matching backend authorization.
8. Use existing `AppSelect`, `AppDatePicker`, `Modal`, DaisyUI card/table/badge/alert/button patterns.
9. Test both light and dark themes, desktop and narrow layouts, loading/empty/error/success states, and keyboard focus.
10. Run `npm run build`.

[SPEC] Forms must:

- Associate every field with a visible label or accessible name.
- Show required state and validation near the relevant field.
- Preserve user input after recoverable API failures.
- Normalize numeric/date values before sending them.
- Prevent duplicate submissions.
- Confirm destructive operations.
- Refresh or update local data after successful mutations without requiring a full-page reload.

## 15. Testing and verification

Run the smallest relevant checks during development and the full applicable set before handoff.

### Backend minimum

```bash
cd backend
php bin/console about
php bin/console debug:router --show-controllers
php bin/phpunit
```

When entities or schema change and a configured database is available:

```bash
php bin/console doctrine:schema:validate
```

Add tests as follows:

- Route changes: update route registration tests.
- Authentication/authorization changes: security/authenticator tests.
- Controller behavior: HTTP tests for success, invalid input, missing resource, conflict, and unauthorized access.
- Repository query changes: integration tests using a disposable test database when query correctness depends on SQL behavior.

### Frontend minimum

```bash
cd frontend
npm run build
```

[NOTE] No frontend test runner is currently configured. Do not claim automated UI test coverage. For material UI work, perform a browser smoke test and report the screens/themes checked. If the task adds a frontend test framework, configure a stable `npm test` script and document it in `README.md`.

### Launcher validation

```bash
bash -n start.sh
./start.sh --help
```

Do not start a second server over an occupied port. Inspect with:

```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN
lsof -nP -iTCP:5173 -sTCP:LISTEN
```

## 16. Definition of done

A change is complete only when:

- The requested behavior works end to end.
- The implementation respects the layers in section 3.
- API/schema/type changes are synchronized across backend and frontend.
- New queries use bound parameters and appropriate indexes.
- Authorization is enforced server-side.
- Errors follow the API envelope and do not leak internals.
- Shared frontend primitives are reused.
- Light and dark themes retain readable text, visible borders, correct shadows, and consistent radii/heights.
- Loading, empty, error, success, disabled, and responsive states are handled where applicable.
- Applicable build/tests pass, or the exact blocker is reported.
- `README.md` and this file are updated when architecture, setup, scripts, routes, schema strategy, or conventions change.
- Unrelated user changes remain untouched.

## 17. Patterns to reject

[SPEC] Do not merge code containing these patterns:

- Raw user input interpolated into SQL.
- Direct database access from a controller or entity.
- A new schema file outside `backend/migrations/`.
- Plaintext passwords, raw token storage, or secrets committed to Git.
- Whole-entity JSON serialization without an explicit safe contract.
- Hard-coded backend origins in frontend code.
- Direct `react-select`, native date picker, or one-off modal implementations when a shared component exists.
- Hard-coded white/black/gray styling that breaks dark mode.
- Per-page overrides that make buttons, badges, inputs, borders, radii, or shadows inconsistent.
- Role-based hiding presented as authorization.
- Unbounded large queries or N+1 loops.
- Destructive Git/database commands without explicit user authorization.
- Claims that tests passed when they were not run.

## 18. Unresolved and intentionally incomplete areas

[NOTE] Booking steps for accessories, additional drivers, advanced payments, and legal documentation currently contain placeholder content. Preserve their step boundaries and do not represent them as completed business functionality.

[?] The repository has Doctrine Migrations Bundle installed while using one SQL clean-install baseline. Before introducing generated incremental migrations, confirm whether the user wants to replace or augment the one-file policy, then update both this contract and `README.md`.

[NOTE] The current frontend persists bearer tokens in localStorage. Treat any deployment-hardening request as an authentication/security design change, not a cosmetic refactor.
