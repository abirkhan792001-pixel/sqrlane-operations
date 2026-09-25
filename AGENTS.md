<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to Lovable. Avoid rewriting published git history.
<!-- LOVABLE:END -->

- Keep SQRlane frontend-only; all operational data comes through `src/lib/api.ts` with the recorded fixture fallback, because the production host proxies the existing API.
- Keep shared navigation, scenario state, fallback status, and local approvals in one client context, because all seven pages must stay synchronized without persistence.
- Build each major dashboard view as its own TanStack route, because pages need stable URLs and unique metadata.
- The saved TMS connection lives in app-context (localStorage `sqrlane.tms`) and is sent with Ask, Run, Initial and write-backs, because every view must describe the same book.
- Keep Home chat history browser-only in localStorage `sqrlane.chats`, keyed by the `?chat=` URL, because chats must reopen without adding backend persistence.
