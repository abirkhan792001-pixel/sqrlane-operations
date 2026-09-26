import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { runApprovalKeys } from "@/lib/approval-log";
import { markOnboarding } from "@/lib/onboarding";
import { correctWorkflow, getInitialFor, getWorkflow, loadConnection, recordedRunData, recordedWorkflowData, resetWorkflow, runScenarioWith, saveConnection, type CorrectionResult, type RunData, type ScenarioId, type TmsConnection, type WorkflowData } from "@/lib/api";
import { compareRuns, loadLastRun, saveLastRun, snapshotRun, type RunChange } from "@/lib/run-history";

type ApprovalKey = string;
type AppState = {
  run: RunData; workflow: WorkflowData; recorded: boolean; loading: boolean; progress: number; selectedScenario: ScenarioId;
  setSelectedScenario: (id: ScenarioId) => void; executeRun: () => Promise<void>; approved: Set<ApprovalKey>; approve: (keys: ApprovalKey[]) => void;
  correct: (input: { item: string; right: string; cue: string }) => Promise<CorrectionResult>; resetLessons: () => Promise<void>;
  connection: TmsConnection | null; applyConnection: (c: TmsConnection | null) => Promise<void>;
  runChanges: RunChange[] | null;
};
const Context = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [run, setRun] = useState<RunData>(recordedRunData); const [workflow, setWorkflow] = useState<WorkflowData>(recordedWorkflowData);
  const [recorded, setRecorded] = useState(false); const [loading, setLoading] = useState(false); const [progress, setProgress] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("hamburg"); const [approved, setApproved] = useState<Set<string>>(new Set());
  const [connection, setConnection] = useState<TmsConnection | null>(null);
  const [runChanges, setRunChanges] = useState<RunChange[] | null>(null);
  const runId = run.ran_at ?? "not-run";

  async function loadBoard(conn: TmsConnection | null) {
    const [initial, wf] = await Promise.allSettled([getInitialFor(conn), getWorkflow()]);
    let fallback = false;
    if (initial.status === "fulfilled" && "shipments" in initial.value) setRun(initial.value); else fallback = true;
    if (wf.status === "fulfilled") setWorkflow(wf.value); else fallback = true;
    setRecorded(fallback);
  }
  useEffect(() => { const c = loadConnection(); setConnection(c); void loadBoard(c); }, []);
  useEffect(() => { setApproved(runApprovalKeys(runId)); }, [runId]);

  async function applyConnection(c: TmsConnection | null) { if(c) markOnboarding("connection"); saveConnection(c); setConnection(c); setApproved(new Set()); await loadBoard(c); }
  async function executeRun() { markOnboarding("scenario"); setLoading(true); setProgress(1); const timer = setInterval(() => setProgress(p => Math.min(p + 1, 3)), 12000); try { const next=await runScenarioWith(selectedScenario, connection);const snapshot=snapshotRun(next,selectedScenario);const previous=loadLastRun();setRunChanges(previous?compareRuns(previous,snapshot):null);saveLastRun(snapshot);setRun(next); markOnboarding("run"); setRecorded(false) } catch { const snapshot=snapshotRun(recordedRunData,"hamburg");const previous=loadLastRun();setRunChanges(previous?compareRuns(previous,snapshot):null);saveLastRun(snapshot);setRun(recordedRunData); setSelectedScenario("hamburg"); setRecorded(true) } finally { clearInterval(timer); setProgress(4); setLoading(false) } }
  async function correct(input: { item: string; right: string; cue: string }) { try { return await correctWorkflow({ ...input, kind: "intent" }) } catch { setRecorded(true); return { accepted: false, reason: "Correction unavailable while showing a recorded run.", lesson: "", fixed_item: input.item, propagated: [], run: null } } }
  async function resetLessons() { try { await resetWorkflow() } catch { setRecorded(true) } }
  const chooseScenario = (id: ScenarioId) => { markOnboarding("scenario"); setSelectedScenario(id); };
  const value = useMemo(() => ({ run, workflow, recorded, loading, progress, selectedScenario, setSelectedScenario: chooseScenario, executeRun, approved, approve: (keys: string[]) => setApproved(s => new Set([...s, ...keys])), correct, resetLessons, connection, applyConnection, runChanges }), [run, workflow, recorded, loading, progress, selectedScenario, approved, connection, runChanges]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp() { const value = useContext(Context); if (!value) throw new Error("AppProvider missing"); return value }
