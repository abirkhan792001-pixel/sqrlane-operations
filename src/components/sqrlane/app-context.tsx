import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { correctWorkflow, getInitial, getWorkflow, recordedRunData, recordedWorkflowData, resetWorkflow, runScenario, type CorrectionResult, type RunData, type ScenarioId, type WorkflowData } from "@/lib/api";

type ApprovalKey = string;
type AppState = {
  run: RunData; workflow: WorkflowData; recorded: boolean; loading: boolean; progress: number; selectedScenario: ScenarioId;
  setSelectedScenario: (id: ScenarioId) => void; executeRun: () => Promise<void>; approved: Set<ApprovalKey>; approve: (keys: ApprovalKey[]) => void;
  correct: (input: { item: string; right: string; cue: string }) => Promise<CorrectionResult>; resetLessons: () => Promise<void>;
};
const Context = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
 const [run,setRun]=useState<RunData>(recordedRunData); const [workflow,setWorkflow]=useState<WorkflowData>(recordedWorkflowData);
 const [recorded,setRecorded]=useState(false); const [loading,setLoading]=useState(false); const [progress,setProgress]=useState(0);
 const [selectedScenario,setSelectedScenario]=useState<ScenarioId>("hamburg"); const [approved,setApproved]=useState<Set<string>>(new Set());
 useEffect(()=>{ let active=true; Promise.allSettled([getInitial(),getWorkflow()]).then(([initial,wf])=>{ if(!active)return; let fallback=false; if(initial.status==="fulfilled" && "shipments" in initial.value) setRun(initial.value); else fallback=true; if(wf.status==="fulfilled") setWorkflow(wf.value); else fallback=true; setRecorded(fallback); }); return()=>{active=false};},[]);
 async function executeRun(){ setLoading(true);setProgress(1); const timer=setInterval(()=>setProgress(p=>Math.min(p+1,3)),12000); try{setRun(await runScenario(selectedScenario));setRecorded(false)}catch{setRun(recordedRunData);setSelectedScenario("hamburg");setRecorded(true)}finally{clearInterval(timer);setProgress(4);setLoading(false)}}
 async function correct(input:{item:string;right:string;cue:string}){try{return await correctWorkflow({...input,kind:"intent"})}catch{return {accepted:true,lesson:"L-001",fixed_item:input.item,propagated:[],run:null}}}
 async function resetLessons(){try{await resetWorkflow()}catch{setRecorded(true)}}
 const value=useMemo(()=>({run,workflow,recorded,loading,progress,selectedScenario,setSelectedScenario,executeRun,approved,approve:(keys:string[])=>setApproved(s=>new Set([...s,...keys])),correct,resetLessons}),[run,workflow,recorded,loading,progress,selectedScenario,approved]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp(){const value=useContext(Context);if(!value)throw new Error("AppProvider missing");return value}
