import type { TmsTestResult } from "./api";
export type Verification = { key: string; kind: "api" | "writeback"; verified_at: string; host: string; detail?: string | undefined };
const KEY = "sqrlane.tms.verifications";
export function connectionKey(kind: Verification["kind"], url: string) { return `${kind}|${url}`; }
export function loadVerifications(): Verification[] { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
export function getVerification(kind: Verification["kind"], url?: string | null) { if (!url) return undefined; const key = connectionKey(kind, url); return loadVerifications().find(x => x.key === key); }
export function saveVerification(kind: Verification["kind"], url: string, result: TmsTestResult) { if (!result.ok) return; const entry: Verification = { key: connectionKey(kind, url), kind, verified_at: new Date().toISOString(), host: result.host ?? safeHost(url), detail: result.detail }; try { const rows = loadVerifications().filter(x => x.key !== entry.key); localStorage.setItem(KEY, JSON.stringify([...rows, entry])); window.dispatchEvent(new Event("sqrlane-verification")); } catch { /* storage unavailable */ } }
function safeHost(url: string) { try { return new URL(url).host; } catch { return ""; } }
