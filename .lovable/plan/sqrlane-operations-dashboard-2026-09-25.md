# SQRlane operations dashboard

## Build
- Create a calm, desktop-first operations shell with the honesty banner, sidebar navigation, search palette, top controls, alert bell, and recorded-run status.
- Add seven routed views: Overview, Shipments, Desk, Risk feed, Approvals, Agents, and TMS link.
- Implement shared cards, pills, tables, charts, drawers, skeleton/loading states, tooltips, filters, and local approval state.
- Bundle Geist fonts locally and define the complete semantic color, typography, spacing, and motion system.

## Data and interactions
- Store the supplied recording verbatim as a typed fixture and normalize its three endpoint payloads.
- Add one typed API module for every specified request, with timeout-aware scenario runs and automatic fixture fallback.
- Derive every count, ratio, chart value, status, worker summary, draft, and queued change from API responses.
- Support scenario runs, shipment and inbox detail drawers, workflow corrections, workflow reset, search navigation, and local-only approvals.

## Credibility safeguards
- Keep all sends disabled by design: approvals remain local and every draft/write-back uses the required wording.
- Label the TMS only as a demo connector, preserve exact worker modes, sanitize source suffixes, and avoid invented metrics or people.
- Show actionable empty states and the supplied honesty banner everywhere.

## Verification
- Check all routes and metadata, API fallback behavior, responsive desktop/mobile layouts, keyboard search, drawers, charts, and loading states.
- Validate the preview visually and confirm no build, console, runtime, or network errors remain.

## Technical details
- TanStack Start routes with React 19, Tailwind v4 semantic tokens, shadcn-style primitives, Recharts, and Lucide icons.
- Frontend-only state; no authentication, database, cloud service, or custom backend.
