import { recordedRun } from "@/data/fixtures";

export type RecordedFixture = typeof recordedRun;
export type RunData = RecordedFixture["POST /run (after 'Inject Hamburg strike')"];
export type WorkflowData = RecordedFixture["GET /api/workflow (the everyday desk)"];
export type InitialData = RecordedFixture["GET /api/initial (before the button)"] | RunData;
export type ScenarioId = RunData["scenarios"][number]["id"];
export type WorkflowCorrection = { item: string; kind: "intent"; right: string; cue: string };
export type CorrectionResult = { accepted: boolean; reason?: string; lesson: string; fixed_item: string; propagated: Array<{ item: string }>; run: unknown };

export const recordedRunData = recordedRun["POST /run (after 'Inject Hamburg strike')"] as RunData;
export const recordedWorkflowData = recordedRun["GET /api/workflow (the everyday desk)"] as WorkflowData;
const baseUrl = import.meta.env["VITE_API_BASE"] ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json() as Promise<T>;
}

export const getInitial = () => request<InitialData>("/api/initial");
export const runScenario = (scenario: ScenarioId) => request<RunData>("/run", { method: "POST", body: JSON.stringify({ scenario, live: true }) });
export const getWorkflow = () => request<WorkflowData>("/api/workflow");
export const correctWorkflow = (body: WorkflowCorrection) => request<CorrectionResult>("/api/workflow/correct", { method: "POST", body: JSON.stringify(body) });
export const resetWorkflow = () => request<{ accepted?: boolean }>("/api/workflow/reset", { method: "POST" });
