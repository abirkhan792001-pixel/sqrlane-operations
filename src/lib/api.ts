import { recordedRun } from "@/data/fixtures";

export type RecordedFixture = typeof recordedRun;
type RawRun = RecordedFixture["POST /run (after 'Inject Hamburg strike')"];
export type RunData = Omit<RawRun, "ai"> & { ai?: RawRun["ai"] };
type RawWorkflow = RecordedFixture["GET /api/workflow (the everyday desk)"];
export type WorkflowMessage = RawWorkflow["messages_sample"][number];
export type WorkflowOutput = RawWorkflow["outputs_sample"][number];
export type WorkflowData = Omit<RawWorkflow, "messages_sample" | "outputs_sample"> & { messages: WorkflowMessage[]; outputs: WorkflowOutput[] };
export type InitialData = { shipments_count?: number; state?: string } | RunData;
export type ScenarioId = RunData["scenarios"][number]["id"];
export type WorkflowCorrection = { item: string; kind: "intent"; right: string; cue: string };
export type CorrectionResult = { accepted: boolean; reason?: string; lesson: string; fixed_item: string; propagated: Array<{ item: string }>; run: unknown };

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
