# SQRlane Operations

Build "SQRlane" — the operations dashboard for an AI-agent product for freight forwarders. It will be deployed at app.sqrlane.com. This first message is the whole spec; please build all of it.

## Stack — frontend only
- Vite + React + TypeScript + Tailwind + shadcn/ui. Recharts for the two charts.
- NO backend of your own: no Supabase, no Lovable Cloud, no database, no auth, no edge functions, no login screen. Every piece of data comes from an existing HTTP API (below).
- Font: Geist and Geist Mono from the `geist` npm package (self-hosted in the bundle). No Google Fonts, no CDN, nothing loaded from another host.
- One file `src/lib/api.ts` with typed functions for every endpoint. Base URL = `import.meta.env.VITE_API_BASE ?? ""` (same origin in production — the deployment proxies these paths). If a request fails, fall back to the recorded fixtures in `src/data/fixtures.ts` and show a small amber badge in the top bar: "Showing a recorded run".
- The attached file `sqrlane-recorded-run.json` is a real recorded run of the API. Put its JSON into `src/data/fixtures.ts` verbatim (export it as a const), and derive the TypeScript types from it. Its top-level keys are the three endpoints it was recorded from.

## The API (same origin)
- `GET /api/initial` → the calm board before anything happens (same shape as /run, all shipments on plan).
- `POST /run` body `{"scenario": "hamburg" | "redsea" | "rhine", "live": true}` → one full cycle (can take up to ~50 s — show skeletons shaped like the content, and a progress line "Reading sources · Deciding · Drafting · Queuing to the TMS"). Response shape = fixture key "POST /run …".
- `GET /api/workflow` → the everyday desk working the inbox. Shape = fixture key "GET /api/workflow …" (the real response names the arrays `messages` and `outputs`; the fixture holds samples of them as `messages_sample` and `outputs_sample`, same fields).
- `POST /api/workflow/correct` body `{"item": "IN-104", "kind": "intent", "right": "rate_request", "cue": "re-quote"}` → `{accepted, reason?, lesson, fixed_item, propagated: [{item}], run}`.
- `POST /api/workflow/reset` → forgets every lesson.

## Look & feel — after Peec AI's dashboard (layout and feel only; colours, names and content are ours)
- Calm, airy, light. Canvas #fafafa, white cards with 1px hairline borders (rgba(0,0,0,.08)), 12px radius, almost no shadow. Near-black #171717 for primary buttons and active states. Colour is spent on state only: green = live / on plan, amber = hold / scripted / needs a look, blue = demo / reroute accent, red = breach.
- Left sidebar (~248px): wordmark "SQRlane" with a small black square mark, a search box (⌘K palette over views + bookings), grouped nav with small uppercase grey group labels, count pills on the right. No workspace called "Acme Inc", no user avatar, no fake team — the sidebar foot shows "Decision engine · <ai.model or 'rules'>" from the run.
- Top bar: page title + one-line subtitle on the left; on the right a segmented scenario picker (Hamburg port strike · Red Sea closure · Rhine low water) and a black primary button "Run scenario". Last-run stamp under it.
- Pages are built from bento-style card grids like Peec: a row of 4 stat cards (small grey label, big tabular number, one-line caption, a pill holding a FACT from the run — never a delta), then wider cards with a chart or a compact table. Tables: small grey header row, 44px rows, subtle row hover, pill tags, monospace ids.
- Row click opens a right-side drawer (Sheet), never a new page.
- Motion is small: fade/slide 150–200 ms; respect prefers-reduced-motion.
- Honest banner, one thin line at the very top of every page: "The risk detection is real — shipments are synthetic, so a disruption can be shown on demand. The TMS link is a demo connector: nothing is sent and nothing is written."

## Navigation and pages
OVERVIEW
1. **Overview** — 4 stat cards counted from the run: Bookings read (tms.bookings_read), Rerouted, Held, On plan (summary). A donut "Board outcome" (reroute / hold / on plan, counts + share, total in the middle). A bar chart "Schedule pressure": per shipment, slack days vs the delay the disruption imposes (decision.delay_days); label only the bar where delay exceeds slack. A card "Active disruptions" (risk.events: title, source, chokepoint, severity pill). A card "Waiting for you" = count of drafts + queued write-backs, linking to Approvals. A strip of all Workers as small pills (dot, name, mode tag).
OPERATIONS
2. **Shipments** — table: id, cargo, lane (origin → final_destination), customer, carrier, slack, state pill (on plan / reroute / hold). Drawer: decision headline, reasoning paragraph, "decided by" (rules or model), triggering event, revised ETA, the two drafts (collapsed, with "Draft ready · waits for your approval" and an Approve button), and this booking's queued TMS write-backs (field: from → to, agent, "Queued — not written").
3. **Desk** (the everyday inbox) — 4 stat cards from workflow.stats (Mails, Routed, Escalated, Playbook fixes). Table of the 13 mails: id, sender, subject, intent pill (with "rules"/"model"/"lesson"), the agents it passed through (path as small chips), a "needs a look" flag. Drawer: the numbered conversation between agents (from `messages` for that item — each bubble names the agent, and hovering a bubble shows its `why` in a small dark tooltip titled "Why"), then the outputs (drafts: "Draft ready · waits for your approval" + Approve; writes: "Queued — not written"). Under it a small "Correct this" form: pick the right intent + cue phrase → POST correct → show the report ("Learned L-001 … fixed IN-104, and IN-109 too").
4. **Risk feed** — events with severity, chokepoint, source. Source line: "N of M sources read" from risk.live_sources_read / live_sources_total, with a green "live" chip ONLY if N > 0, otherwise an amber "no live source" chip.
5. **Approvals** — one queue for everything waiting: drafts (from shipments[].drafts and desk outputs of kind mail) and write-backs (tms.writebacks + desk outputs of kind tms), GROUPED BY BOOKING. Segmented control: Awaiting / Approved / All. Checkbox select → button "Approve 3" with the count on it. Approving is local state only — say so in the empty state. The bell in the top bar shows the same awaiting count, with a dot only when it is > 0.
SYSTEM
6. **Agents** — all 16, in two groups: Risk layer (Risk, Routing, Comms, Planner, TMS Link) and Everyday desk (the rest, from workflow.groups). Card each: name, mode tag (LIVE green / SCRIPTED amber / DEMO blue), role, and the run's own summary line.
7. **TMS link** — connector card ("Demo connector · connected (demo)"), bookings read, changes queued, bookings affected, queued_by_agent as a small bar list, then the write-back table. Under it the line "No vendor, no credential, no endpoint — nothing is ever written."

## Rules that must never be broken (this product's credibility rests on them)
1. Never invent a number. Every figure on screen is counted from the API payload. No sparklines, no trends, no "vs last week", no "+12%", no percentages that are not computed from the payload, no fake users or activity feed.
2. Nothing is ever sent. There is NO Send button anywhere — only Approve. Drafts read "Draft ready · waits for your approval"; write-backs read "Queued — not written".
3. The TMS is always labelled a demo connector. Never present it as a live integration.
4. Mode tags are the honesty: LIVE, SCRIPTED, DEMO exactly as the data says. Never show a scripted agent as live.
5. Never name a human language in UI copy (no "German", "English", "Arabic", "multilingual" …). Say "regional source" and "international wires". Outlet names like "NDR Hamburg" are fine. The API's `source` strings can carry a parenthetical such as "(… regional RSS)" — always display only the part before " (".
6. Use the agent names exactly as in the data. Never use the words "Copilot", "Rate Manager", "DocuMind" or "Track & Trace".
7. No chat input box anywhere. The only thing a person types is a correction on the Desk page.
8. Empty states name the next action ("Run a scenario to see decisions here").

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/14d353a6-8ae8-4da0-afcd-e57a47841822).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
