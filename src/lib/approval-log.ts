import { markOnboarding } from "@/lib/onboarding";

export type ApprovalLogEntry = {
  key: string; run_id: string; booking: string; agent: string; kind: string;
  summary: string; approver: string; approved_at: string; destination: string; result_status: string;
};
const LOG_KEY = "sqrlane.approvals.log";
const PERSON_KEY = "sqrlane.approver";
export function loadApprovalLog(): ApprovalLogEntry[] { try { const raw = localStorage.getItem(LOG_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
export function saveApproval(entry: ApprovalLogEntry) { markOnboarding("change"); try { const entries = loadApprovalLog().filter(x => !(x.run_id === entry.run_id && x.key === entry.key)); localStorage.setItem(LOG_KEY, JSON.stringify([...entries, entry])); window.dispatchEvent(new Event("sqrlane-approvals")); } catch { /* storage unavailable */ } }
export function updateApproval(runId: string, key: string, patch: Partial<ApprovalLogEntry>) { const entry = loadApprovalLog().find(x => x.run_id === runId && x.key === key); if (entry) saveApproval({ ...entry, ...patch }); }
export function loadApprover() { try { return localStorage.getItem(PERSON_KEY) ?? ""; } catch { return ""; } }
export function saveApprover(name: string) { try { localStorage.setItem(PERSON_KEY, name); } catch { /* storage unavailable */ } }
export function runApprovalKeys(runId: string) { return new Set(loadApprovalLog().filter(x => x.run_id === runId).map(x => x.key)); }
