import { recordedRun } from "@/data/fixtures";
import { recordedInsights, type recordedAnswers } from "@/data/ask-fixtures";
import { recordedMap } from "@/data/map-fixture";

export type RecordedFixture = typeof recordedRun;
type RawRun = RecordedFixture["POST /run (after 'Inject Hamburg strike')"];
export type RunData = Omit<RawRun, "ai" | "tms"> & { ai?: RawRun["ai"]; tms: Omit<RawRun["tms"], "writebacks"> & { writebacks: Writeback[] } };
type RawWorkflow = RecordedFixture["GET /api/workflow (the everyday desk)"];
export type WorkflowMessage = RawWorkflow["messages_sample"][number];
export type WorkflowOutput = RawWorkflow["outputs_sample"][number] & { queued_at?: string | null };
export type WorkflowData = Omit<RawWorkflow, "messages_sample" | "outputs_sample"> & { messages: WorkflowMessage[]; outputs: WorkflowOutput[] };
export type InitialData = { shipments_count?: number; state?: string } | RunData;
export type ScenarioId = RunData["scenarios"][number]["id"];
export type WorkflowCorrection = { item: string; kind: "intent"; right: string; cue: string };
export type CorrectionResult = { accepted: boolean; reason?: string | undefined; lesson: string; fixed_item: string; propagated: Array<{ item: string }>; run: unknown };
export type WatchlistRow = { id: string; cargo: string; slack_days: number; worst_delay_days: number; margin_days: number; reason: string };
export type InsightsData = Omit<typeof recordedInsights, "watchlist" | "at_stake"> & {
  watchlist: { title: string; subtitle: string; rule: string; rows: WatchlistRow[] };
  at_stake: Omit<typeof recordedInsights.at_stake, "rows"> & { rows: Array<Omit<(typeof recordedInsights.at_stake.rows)[number], "stay_exposure_eur" | "action_exposure_eur" | "avoided_eur"> & { stay_exposure_eur: number | null; action_exposure_eur: number | null; avoided_eur: number | null }> };
};
export type MapData = typeof recordedMap;
export type AskAttachment = { name: string; content: string | null };

export const recordedRunData = normalizeRun(recordedRun["POST /run (after 'Inject Hamburg strike')"]);
const calmDecision = { decision: "no-action", headline: "On plan", reasoning: "", delay_days: 0, triggering_events: [], decided_by: "", revised_eta: null, recommended_route: null, recommended_discharge_port: null };

/** One workflow shape: real API sends messages/outputs, the fixture sends *_sample. */
export function normalizeWorkflow(raw: any): WorkflowData {
  const { messages_sample, outputs_sample, ...rest } = raw ?? {};
  return { ...rest, messages: raw?.messages ?? messages_sample ?? [], outputs: raw?.outputs ?? outputs_sample ?? [] } as WorkflowData;
}

/** Calm board: decision may be null, drafts empty, ai missing. */
export function normalizeRun(raw: any): RunData {
  if (!raw || !Array.isArray(raw.shipments)) return raw;
  const shipments = raw.shipments.map((s: any) => ({ ...s, drafts: s.drafts ?? [], decision: s.decision ?? { ...calmDecision } }));
  const out = { ...raw, shipments };
  if (!raw.ai) delete out.ai;
  return out as RunData;
}

export const recordedWorkflowData = normalizeWorkflow(recordedRun["GET /api/workflow (the everyday desk)"]);
const baseUrl = import.meta.env["VITE_API_BASE"] ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json() as Promise<T>;
}

export const getInitial = () => request<InitialData>("/api/initial").then((r) => ("shipments" in (r as object) ? normalizeRun(r) : r) as InitialData);
export const runScenario = (scenario: ScenarioId) => request<RunData>("/run", { method: "POST", body: JSON.stringify({ scenario, live: true }) }).then(normalizeRun);
export const getWorkflow = () => request<unknown>("/api/workflow").then(normalizeWorkflow);
export const correctWorkflow = (body: WorkflowCorrection) => request<CorrectionResult>("/api/workflow/correct", { method: "POST", body: JSON.stringify(body) });
export const resetWorkflow = () => request<{ accepted?: boolean }>("/api/workflow/reset", { method: "POST" });

// ---- Ask, TMS connect, write-back ----
type RecordedAnswer = (typeof recordedAnswers)[keyof typeof recordedAnswers];
export type AskMessage = { seq: number; from: string; to: string; kind: string; text: string; why?: string | null };
export type AskAnswer = Omit<RecordedAnswer, "conversation" | "facts" | "links" | "suggestions" | "checked_against" | "routed_to"> & {
  routed_to?: { id: string; name: string; mode: string } | null;
  conversation: AskMessage[]; facts: Array<{ label: string; value: string | number }>;
  links: Array<{ label: string; view: string; id?: string | null }>; suggestions: string[];
  checked_against?: { note?: string | null } & Record<string, unknown>; examples?: string[];
  connection_preview?: ConnectResult | null;
  desk_item?: { id?: string; outputs?: Array<{ worker?: string; subject?: string; action?: string; status?: string }> } | null;
  worded_by?: "model" | "code";
  plain_text?: string;
  wording_note?: string | null;
};
export type TmsFileConnection = { kind: "file"; name: string; source: string; read_at: string; bookings: unknown[]; writeback_url?: string | null; token?: string | undefined; auth_header?: string | undefined };
export type TmsApiConnection = { kind: "api"; name: string; source: string; url: string; token: string; auth_header: string; records_path?: string | undefined; writeback_url?: string | null };
export type TmsConnection = TmsFileConnection | TmsApiConnection;
export type ConnectBody = ({ kind: "file"; filename: string; content: string } | { kind: "api"; url: string; token: string; auth_header: string; records_path?: string | undefined }) & { writeback_url?: string };
export type ConnectResult = { ok: boolean; error?: string | undefined; kind: "file" | "api"; name: string; source: string; read_at: string; rows_read: number; bookings: unknown[]; not_covered: Array<{ row: number | string; ref?: string | null; reason: string }>; mapping: Array<{ column: string; field: string; used_for: string }>; unmapped_columns: string[]; warnings: string[]; writeback_url?: string | null };
export type Writeback = RawRun["tms"]["writebacks"][number] & { queued_at?: string | null; severity?: string | null };
export type PushResult = { ok: true; status: number; host: string; response?: unknown } | { ok: false; error: string };
export type TmsTestBody = { kind: "api" | "writeback"; url: string; token?: string | undefined; auth_header?: string | undefined; records_path?: string | undefined };
export type TmsTestResult = { ok: boolean; host?: string; detail?: string; error?: string };

export const askDesk = (question: string, scenario: string, connection: TmsConnection | null, attachments: AskAttachment[] = []) =>
  request<AskAnswer>("/api/ask", { method: "POST", body: JSON.stringify({ question, scenario, use_llm: true, connection, attachments }) });
export const getInsights = (scenario: ScenarioId, connection: TmsConnection | null) => connection
  ? request<InsightsData>("/api/insights", { method: "POST", body: JSON.stringify({ scenario, connection }) })
  : request<InsightsData>(`/api/insights?scenario=${encodeURIComponent(scenario)}`);
export const getMap = (scenario: ScenarioId, connection: TmsConnection | null) => connection
  ? request<MapData>("/api/map", { method: "POST", body: JSON.stringify({ scenario, connection }) })
  : request<MapData>(`/api/map?scenario=${encodeURIComponent(scenario)}`);
export const connectTms = (body: ConnectBody) => request<ConnectResult>("/api/tms/connect", { method: "POST", body: JSON.stringify(body) });
export const testTms = (body: TmsTestBody) => request<TmsTestResult>("/api/tms/test", { method: "POST", body: JSON.stringify(body) });
export async function getSampleCsv() { const r = await fetch(`${baseUrl}/api/tms/sample.csv`); if (!r.ok) throw new Error(String(r.status)); return r.text(); }
export const pushWriteback = (body: { operation: Writeback; writeback_url: string; token?: string | undefined; auth_header?: string | undefined }) =>
  request<PushResult>("/api/tms/writeback", { method: "POST", body: JSON.stringify(body) });
export const getInitialFor = (connection: TmsConnection | null) => connection
  ? request<InitialData>("/api/initial", { method: "POST", body: JSON.stringify({ connection }) }).then((r) => ("shipments" in (r as object) ? normalizeRun(r) : r) as InitialData)
  : getInitial();
export const runScenarioWith = (scenario: ScenarioId, connection: TmsConnection | null) =>
  request<RunData>("/run", { method: "POST", body: JSON.stringify({ scenario, live: true, connection }) }).then(normalizeRun);

const TMS_KEY = "sqrlane.tms";
export function loadConnection(): TmsConnection | null { try { const v = localStorage.getItem(TMS_KEY); return v ? JSON.parse(v) : null; } catch { return null; } }
export function saveConnection(c: TmsConnection | null) { try { c ? localStorage.setItem(TMS_KEY, JSON.stringify(c)) : localStorage.removeItem(TMS_KEY); } catch { /* storage unavailable */ } }
export function hostOf(url?: string | null) { try { return url ? new URL(url).host : ""; } catch { return ""; } }
