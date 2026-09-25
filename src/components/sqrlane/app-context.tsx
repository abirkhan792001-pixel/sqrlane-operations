import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { correctWorkflow, getInitialFor, getWorkflow, loadConnection, recordedRunData, recordedWorkflowData, resetWorkflow, runScenarioWith, saveConnection, type CorrectionResult, type RunData, type ScenarioId, type TmsConnection, type WorkflowData } from "@/lib/api";

type ApprovalKey = string;
type AppState = {
  run: RunData; workflow: WorkflowData; recorded: boolean; loading: boolean; progress: number; selectedScenario: ScenarioId;
  setSelectedScenario: (id: ScenarioId) => void; executeRun: () => Promise<void>; approved: Set<ApprovalKey>; approve: (keys: ApprovalKey[]) => void;
  correct: (input: { item: string; right: string; cue: string }) => Promise<CorrectionResult>; resetLessons: () => Promise<void>;
  connection: TmsConnection | null; useConnection: (c: TmsConnection | null) => Promise<void>;
};
const Context = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [run, setRun] = useState<RunData>(recordedRunData); const [workflow, setWorkflow] = useState<WorkflowData>(recordedWorkflowData);
  const [recorded, setRecorded] = useState(false); const [loading, setLoading] = useState(false); const [progress, setProgress] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("hamburg"); const [approved, setApproved] = useState<Set<string>>(new Set());
  const [connection, setConnection] = useState<TmsConnection | null>(null);

  async function loadBoard(conn: TmsConnection | null) {
    const [initial, wf] = await Promise.allSettled([getInitialFor(conn), getWorkflow()]);
    let fallback = false;
    if (initial.status === "fulfilled" && "shipments" in initial.value) setRun(initial.value); else fallback = true;
    if (wf.status === "fulfilled") setWorkflow(wf.value); else fallback = true;
    setRecorded(fallback);
  }
  useEffect(() => { const c = loadConnection(); setConnection(c); void loadBoard(c); }, []);

  async function useConnection(c: TmsConnection | null) { saveConnection(c); setConnection(c); setApproved(new Set()); await loadBoard(c); }
  async function executeRun() { setLoading(true); setProgress(1); const timer = setInterval(() => setProgress(p => Math.min(p + 1, 3)), 12000); try { setRun(await runScenarioWith(selectedScenario, connection)); setRecorded(false) } catch { setRun(recordedRunData); setSelectedScenario("hamburg"); setRecorded(true) } finally { clearInterval(timer); setProgress(4); setLoading(false) } }
  async function correct(input: { item: string; right: string; cue: string }) { try { return await correctWorkflow({ ...input, kind: "intent" }) } catch { setRecorded(true); return { accepted: false, reason: "Correction unavailable while showing a recorded run.", lesson: "", fixed_item: input.item, propagated: [], run: null } } }
  async function resetLessons() { try { await resetWorkflow() } catch { setRecorded(true) } }
  const value = useMemo(() => ({ run, workflow, recorded, loading, progress, selectedScenario, setSelectedScenario, executeRun, approved, approve: (keys: string[]) => setApproved(s => new Set([...s, ...keys])), correct, resetLessons, connection, useConnection }), [run, workflow, recorded, loading, progress, selectedScenario, approved, connection]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp() { const value = useContext(Context); if (!value) throw new Error("AppProvider missing"); return value }
