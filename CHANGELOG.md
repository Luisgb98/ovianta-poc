# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Schedule tab** — full calendar implementation replacing the placeholder:
  - New `appointments` bounded context (`src/modules/appointments/`) following hexagonal architecture (domain, ports, use-cases, mongo/api/in-memory infrastructure).
  - `Appointment` entity with `id`, `patientId`, `patientName`, `doctor`, `type`, `status` (`scheduled`/`completed`/`cancelled`/`no-show`), `start` (ISO wall-clock), `durationMin`, `notes`.
  - Five use-cases: `list`, `create`, `reschedule`, `cancel`, `getById` — all with co-located Vitest tests driven by `InMemoryAppointmentRepository`.
  - Pure domain `hasConflict()` invariant (same-doctor overlap detection via `date-fns`), tested independently.
  - `ConflictError` (HTTP 409) added to shared domain errors.
  - REST API: `GET/POST /api/appointments` and `GET/PATCH/DELETE /api/appointments/[id]`; conflict surfaces as 409.
  - **Week time-grid** with `@dnd-kit` drag-to-reschedule (15-min snap), live current-time indicator line, overlap column layout.
  - **Day** and **Agenda** views with view toggle (`Week | Day | Agenda`).
  - **Mini-month navigator** sidebar with appointment dot indicators.
  - `AppointmentDialog` for create (patient picker, doctor/type/date/time/duration/notes) and view/cancel.
  - Optimistic reschedule/cancel with rollback and Sonner toast on `ConflictError`.
  - 21 new i18n translation keys across all 4 locales (es/en/it/pt).
  - 17 realistic seed appointments spanning the current week.
  - New dependencies: `date-fns`, `@dnd-kit/core`, `@dnd-kit/utilities`.

### Changed

- Replaced all primitive `<button>` elements with the design-system `Button` component from `components/atoms/button`.
- Extended the atoms `Button` wrapper with `tab` and `menu` variants (selected state via `aria-pressed`) without modifying shadcn `components/ui/button`.
- Removed unused legacy button CSS (`.link-btn`, `.tab`, `.lang-opt`, `.btn`) and slimmed `.sidebar-toggle` to layout/visibility only.
- Refined `StatusBadge` visuals: blue active, green completed, amber pending, red cancelled; distinct hues and improved pending contrast.
