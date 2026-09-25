<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to Lovable. Avoid rewriting published git history.
<!-- LOVABLE:END -->

- Keep SQRlane frontend-only; all operational data comes through `src/lib/api.ts` with the recorded fixture fallback, because the production host proxies the existing API.
- Keep shared navigation, scenario state, fallback status, and local approvals in one client context, because every page must stay synchronized without persistence.
- Render the booking map from API-authored SVG coordinates and the bundled coastline, because monitoring must stay frontend-only and need no map service.
- Build each major dashboard view as its own TanStack route, because pages need stable URLs and unique metadata.
- The saved TMS connection lives in app-context (localStorage `sqrlane.tms`) and is sent with Ask, Run, Initial and write-backs, because every view must describe the same book.
- Keep Home chat history browser-only in localStorage `sqrlane.chats`, keyed by the `?chat=` URL, because chats must reopen without adding backend persistence.
- Keep first-run progress browser-only in localStorage `sqrlane.onboarding`, because onboarding reflects this device’s local activity without introducing accounts or persistence.
