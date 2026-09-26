import type { RunData } from "./api";

export type RunSnapshot = {
  ran_at: string | null;
  scenario: string;
  bookings: Record<string, string>;
  events: Record<string, string>;
};

export type RunChange = { key: string; text: string; kind: "booking" | "new" | "cleared" };

const KEY = "sqrlane.lastRun";

export function snapshotRun(run: RunData, scenario: string): RunSnapshot {
  return {
    ran_at: run.ran_at ?? null,
    scenario,
    bookings: Object.fromEntries(run.shipments.map((shipment) => [shipment.id, shipment.state])),
    events: Object.fromEntries(run.risk.events.map((event) => [event.event_id, event.title])),
  };
}

export function loadLastRun(): RunSnapshot | null {
  try {
    const value = localStorage.getItem(KEY);
    return value ? JSON.parse(value) as RunSnapshot : null;
  } catch {
    return null;
  }
}

export function saveLastRun(snapshot: RunSnapshot) {
  try { localStorage.setItem(KEY, JSON.stringify(snapshot)); } catch { /* storage unavailable */ }
}

export function compareRuns(previous: RunSnapshot, current: RunSnapshot): RunChange[] {
  const changes: RunChange[] = [];
  for (const [id, state] of Object.entries(current.bookings)) {
    const before = previous.bookings[id];
    if (before && before !== state) changes.push({ key: `booking-${id}`, kind: "booking", text: `${id} ${stateText(before)} → ${stateText(state)}` });
  }
  for (const [id, title] of Object.entries(current.events)) {
    if (!(id in previous.events)) changes.push({ key: `new-${id}`, kind: "new", text: `New disruption: ${title}` });
  }
  for (const [id, title] of Object.entries(previous.events)) {
    if (!(id in current.events)) changes.push({ key: `cleared-${id}`, kind: "cleared", text: `Cleared: ${title}` });
  }
  return changes;
}

function stateText(state: string) {
  if (state === "green" || state === "no-action") return "on plan";
  if (state === "rerouted") return "rerouted";
  if (state === "hold") return "held";
  return state;
}