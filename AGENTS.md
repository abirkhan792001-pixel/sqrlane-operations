<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to Lovable. Avoid rewriting published git history.
<!-- LOVABLE:END -->

- Keep SQRlane frontend-only; all operational data comes through `src/lib/api.ts` with the recorded fixture fallback, because the production host proxies the existing API.
- Keep shared navigation, scenario state, fallback status, and local approvals in one client context, because all seven pages must stay synchronized without persistence.
- Build each major dashboard view as its own TanStack route, because pages need stable URLs and unique metadata.
