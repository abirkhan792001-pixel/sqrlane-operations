import type { RunData, WorkflowData } from "./api";
export const sourceName = (source: string) => source.split(" (")[0];
export const stateLabel = (state: string) => state === "green" || state === "no-action" ? "On plan" : state === "rerouted" ? "Reroute" : state === "hold" ? "Hold" : state;
export const toneFor = (value: string) => value === "live" || value === "green" || value === "on plan" ? "green" : value === "scripted" || value === "hold" || value.includes("look") ? "amber" : value === "demo" || value === "rerouted" || value === "reroute" ? "blue" : value === "high" || value === "breach" ? "red" : "neutral";
export function waitingCount(run: RunData, workflow: WorkflowData) { return run.shipments.reduce((n,s)=>n+s.drafts.length,0) + run.tms.writebacks.length + workflow.outputs_sample.length; }
export function bookingForOutput(output: WorkflowData["outputs_sample"][number]) { return output.booking_ref ?? output.item; }
