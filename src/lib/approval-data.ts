import type { RunData, WorkflowData, Writeback } from "./api";
import { bookingForOutput } from "./presentation";
export type ApprovalKind = "Email draft" | "TMS write-back" | "Desk output";
export type ApprovalRow = { key: string; booking: string; kind: ApprovalKind; title: string; agent: string; severity: string; queued_at: string | null; body?: string | undefined; op?: Writeback | undefined };
export function approvalRows(run: RunData, workflow: WorkflowData): ApprovalRow[] {
  const rows: ApprovalRow[] = [];
  run.shipments.forEach(s => s.drafts.forEach((d, i) => rows.push({ key: `shipment-draft-${s.id}-${i}`, booking: s.id, kind: "Email draft", title: d.subject, body: d.body, agent: "Comms Worker", severity: severityForShipment(s.state), queued_at: null })));
  run.tms.writebacks.forEach((w, i) => rows.push({ key: `tms-${w.booking_ref}-${i}`, booking: w.booking_ref, kind: "TMS write-back", title: w.reason, agent: w.agent, severity: (w as Writeback).severity ?? "none", queued_at: (w as Writeback).queued_at ?? null, op: w }));
  workflow.outputs.forEach(o => rows.push({ key: `desk-${o.id}`, booking: bookingForOutput(o), kind: "Desk output", title: o.subject ?? o.reason, body: "body" in o && typeof o.body === "string" ? o.body : undefined, agent: o.worker, severity: "none", queued_at: o.queued_at ?? null }));
  return rows;
}
export function severityRank(value: string) { return value === "critical" ? 4 : value === "high" ? 3 : value === "medium" ? 2 : value === "low" ? 1 : 0; }
export function ageMs(value: string | null) { const time = value ? Date.parse(value) : NaN; return Number.isFinite(time) ? Math.max(0, Date.now() - time) : 0; }
export function ageLabel(value: string | null) { if (!value) return "time not provided"; const minutes = Math.floor(ageMs(value) / 60000); if (minutes < 1) return "queued just now"; if (minutes < 60) return `queued ${minutes} min ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `queued ${hours} h ago`; return `queued ${Math.floor(hours / 24)} d ago`; }
function severityForShipment(state: string) { return state === "hold" ? "high" : state === "rerouted" ? "medium" : "none"; }
export function rowSummary(row: ApprovalRow) { if (row.op) return row.op.changes.map(c => `${c.field}: ${"from" in c ? String(c.from ?? "") : ""} → ${String(c.to ?? "")}`).join(" · "); return row.title; }
