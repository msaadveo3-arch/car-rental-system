# Redwood UI adaptation

This frontend adapts Oracle Redwood’s visual and interaction principles to the existing React, Tailwind, and DaisyUI architecture. Oracle Sans is bundled from the font files supplied by the project owner; Oracle trademarks and logos are not reproduced.

## Source guidance reviewed

- [Oracle Redwood Design System toolkit](https://redwood.oracle.com/?pageId=CORECDBC4C6D38D74839978B85DB7FDAFD35&shell=simple-content)
- [Oracle Redwood component library](https://redwood.oracle.com/?pageId=CORE0472139870B04C4D8AA5E7A6D73C2F0E&shell=getting-started)
- [Components, templates, and patterns](https://redwood.oracle.com/?pageId=CORE6CE1FA0A24ED4DC68345E7E282654819&shell=simple-content&source=%3Aso%3Afb%3Aor%3Aawr%3Aodv%3A%3A%3A)
- [Oracle Redwood Brand Style Guide](https://www.oracle.com/a/ocom/docs/oracle-brand-guidelines.pdf)
- [Oracle APEX Redwood theme reference](https://static.oracle.com/cdn/apex/22.1.0/themes/theme_42/22.1/docs/Redwood.html)

## Applied principles

- Start with page templates: welcome, dashboard, collection, detail, and advanced create/edit layouts shape the application shell and route pages.
- Use a large, readable default scale with sentence-case headings, shallow hierarchy, and concise labels.
- Use warm neutral surfaces and restrained enterprise-product teal. Oracle Red is a small brand accent, never the dominant action color.
- Use Oracle Sans when it is installed locally, then fall back to the platform UI stack. Georgia is reserved for prominent welcome and page titles.
- Keep one clear primary action in a page header. Secondary actions stay visually quieter.
- Prefer flat bordered surfaces, modest elevation, generous whitespace, and role-specific geometry. Gradients are not part of this adaptation.
- Tables remain the primary desktop collection component, with horizontal scrolling on narrow screens, explicit headers, calm row hover feedback, and action-oriented empty states.
- Banners communicate contextual issues, dialogs are reserved for focused decisions, and toasts remain appropriate for successful transient feedback.
- Preserve keyboard operation, visible focus, semantic labels, Escape-to-close dialogs, focus trapping, and focus restoration.

## Token mapping

The theme definitions live in `tailwind.config.js` and keep the application’s existing `light` and `dark` theme names.

| Role | Light theme source |
|---|---|
| Page background | Neutral 30 / `#F1EFED` |
| Primary action | ERP teal / `#315357` |
| Deep navigation | Teal 170 / `#1E3133` |
| Secondary text | Slate 100 / `#697778` |
| Brand accent | Oracle Red / `#C74634` |
| Warm highlight | Sienna 60 family |

Dark-theme values preserve the same relationships with contrast-adjusted tints. Components must use DaisyUI semantic classes (`base`, `primary`, `neutral`, `success`, `warning`, `error`) rather than fixed light-theme colors.

### Geometry and elevation

Geometry is component-specific; a single global radius must not be used for every surface.

| Component role | Token | Value |
|---|---|---|
| Buttons, inputs, compact icons | `--redwood-radius-control` / `--redwood-radius-icon` | `0.25rem` (4px) |
| Cards | `--redwood-radius-card` | `0.375rem` (6px) |
| Regions, dialogs, menus, alerts | `--redwood-radius-region` | `0.5rem` (8px) |
| Status badges | `--rounded-badge` | `0.375rem` (6px) |
| Standard raised surface | `--redwood-shadow-sm` | `0 2px 4px -2px rgb(0 0 0 / 10%)` |
| Floating menu/dialog | `--redwood-shadow-md` | `0 0.5rem 2rem -10px rgb(0 0 0 / 30%)` |

Standard buttons use 14px type, a 24px line height, and `0.625rem 1rem` padding. Redwood badges use a 24px height, 11px bold label, 6px corners, and `0 0.5rem` padding. Tables themselves remain square inside an 8px region so the outer container owns clipping and elevation.

## Component contract

- Route roots use `RedwoodPage`; page identity, context, navigation, and the single primary action use `RedwoodPageHeader`.
- Work areas use `RedwoodSection`. Nested bordered cards are avoided unless a child is independently actionable.
- Collections use `RedwoodCollectionToolbar` plus `.app-table` inside `overflow-x-auto`, with `RedwoodEmptyState` for action-oriented zero states.
- Advanced create/edit screens use a main form column, contextual guidance rail, grouped sections, and persistent `RedwoodFormActions`.
- Object-detail screens expose record context and status in the page header, then group read-only attributes into scannable sections.
- Guided transactions keep one active step mounted, show progress and context continuously, and provide persistent Back/Next actions.
- The rental workflow keeps a vertical, scroll-safe step rail with Redwood/JET train geometry: 24px markers, 2px connectors, 14px labels, and a bold selected label.
- Visual workspaces reserve the largest region for the interactive canvas and keep observations in a responsive adjacent panel.
- Inputs use shared components or `.app-field`, `.app-select`, and `.app-textarea`.
- Selects, date pickers, and dialogs continue to use `AppSelect`, `AppDatePicker`, and `Modal`.
- Main actions use `btn btn-primary`; low-emphasis actions use `btn btn-ghost`.
- Cards use `.app-card`, `.card`, or `.redwood-card`; regions use `.redwood-section` or `rounded-box`. Controls and icon containers use `rounded-btn`. Badges use the shared 24px × 6px Redwood contract; circular geometry is reserved for avatars and progress markers.
- New visual rules belong in the shared tokens and primitives, not in page-specific hard-coded colors.

## Route template map

| Route | Redwood template |
|---|---|
| Login | Welcome / sign-in |
| Dashboard | Dashboard landing |
| Customers, fleet, rentals | Collection |
| Add/edit customer, add/edit vehicle | Advanced create/edit |
| Rental details | Object detail |
| New rental contract | Guided transaction |
| Inspection queue | Operational worklist |
| 3D pickup inspection | Visual workspace |
| Reference data | Master-detail collection |
| Reports | Dashboard landing / future-state catalogue |
