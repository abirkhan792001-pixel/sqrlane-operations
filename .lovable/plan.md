# Home chat, Connections, and Dashboard

## Scope
- Rename Ask to Home while keeping `/` as the main entry point.
- Add `/dashboard` and `/connections` with the requested sidebar order and unique page metadata.
- Keep the current visual system, operational pages, TMS flow, approval gates, fixture fallback, and honesty rules unchanged.

## Home chat
- Replace the current card-based home with a focused chat workspace: centered empty greeting/composer, then a 760px conversation with a sticky bottom composer and newest-message scrolling.
- Support multiline auto-growth, keyboard submission, paperclip selection, full-chat drag and drop, file validation, removable attachment chips, and the specified readable-file handling.
- Extend the Ask request with attachments and use the selected scenario whenever no run scenario exists.
- Preserve all existing answer details and fallback behavior, while adding copy, connection preview actions, and desk-item output summaries.
- Store up to 20 separate chats in `sqrlane.chats`, restore the selected chat, and add New chat plus Recent chat navigation and deletion in the sidebar. Use a stable chat identifier in the Home URL search state so refreshes reopen the same chat without changing the `/` route.

## Connections
- Add the System-group Connections page with six honest cards: TMS, write-back, mailbox, Claude MCP, risk sources, and AI model.
- Reuse current connection, run, host, copy, and navigation data; do not add unavailable connection actions.
- Move the Claude MCP content off Home and into Connections.

## Dashboard
- Add a typed `getInsights(scenario)` API helper for `/api/insights?scenario=...`, with `recordedInsights` as the fallback and a visible Recorded badge.
- Build the light reference-inspired layout: four payload-backed stat cards, thin vertical workload bars, two horizontal share charts, the existing Desk Today and TMS Connection cards, and the payload note.
- Keep charts token-based, flat, border-only, and responsive as a 2×2 stat grid with stacked charts at 390px.

## Shared updates and verification
- Extract reusable TMS preview, Desk Today, TMS status, and MCP pieces where needed instead of duplicating behavior.
- Fix null `ran_at` display to show “Not run yet”.
- Update the command palette, sidebar counts/navigation, route metadata, roadmap, and the architecture note for local chat persistence.
- Verify the build log, browser console, file upload/drag states, chat restore/delete, palette-to-Home asking, Dashboard fallback, Connections, and 390px overflow across the new pages.

## Technical notes
- Chat records remain browser-only and are guarded by `try/catch`; no backend, authentication, or database is added.
- Attachments are capped before requests at 3 files and 1 MB each. Only the specified text formats are read; other formats send `content: null`.
- Existing API data and recorded fixtures remain authoritative; no metric or status is synthesized.
