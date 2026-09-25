import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Check, ChevronDown, Download, Pencil, Upload } from "lucide-react";
import { recordedSampleConnection } from "@/data/ask-fixtures";
import { connectTms, getSampleCsv, hostOf, pushWriteback, testTms, type ConnectBody, type ConnectResult, type PushResult, type TmsConnection, type TmsTestBody, type TmsTestResult } from "@/lib/api";
import { toneFor } from "@/lib/presentation";
import { ageLabel, ageMs, approvalRows, rowSummary, severityRank, type ApprovalRow } from "@/lib/approval-data";
import { loadApprovalLog, loadApprover, saveApproval, saveApprover, type ApprovalLogEntry } from "@/lib/approval-log";
import { saveVerification } from "@/lib/connection-verification";
import { markOnboarding } from "@/lib/onboarding";
import { Badge, Button, Card } from "@/components/ui";
import { useApp } from "./app-context";
import { SectionHead, StatCard } from "./operations-pages";
import { Metric } from "./system-pages";

/* ------------------------------ TMS link ------------------------------ */
export function TmsPage() {
  const { run, connection } = useApp();
  const entries = Object.entries(run.tms.queued_by_agent); const max = Math.max(...entries.map(([, v]) => v), 1);
  return <div className="space-y-5">
    <Card className="p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><SectionHead title={run.tms.connector} caption={run.tms.honesty}/><p className="text-xs text-muted-foreground">{run.tms.status}</p></div><Badge tone={!connection?"blue":"neutral"}>{!connection?"DEMO":"CONFIGURED"}</Badge></div></Card>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Bookings read" value={run.tms.bookings_read} caption="Bookings available to the desk"/><StatCard label="Changes queued" value={run.tms.queued} caption="Queued — not written" tone="blue"/><StatCard label="Bookings affected" value={run.tms.bookings_affected} caption="Bookings with queued changes" tone="amber"/></div>
    <ConnectPanel />
    <div className="grid gap-5 xl:grid-cols-[.6fr_1.4fr]"><Card className="p-5"><SectionHead title="Queued by agent" />{entries.map(([agent, value]) => <div key={agent} className="mb-4"><div className="mb-1 flex justify-between text-xs"><span>{agent}</span><span className="font-mono">{value}</span></div><div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-state-blue" style={{ width: `${value / max * 100}%` }} /></div></div>)}</Card>
      <Card className="min-w-0 overflow-hidden"><div className="p-5"><SectionHead title="Write-back queue" /></div><div className="hidden sm:block"><table><thead><tr><th>Booking</th><th>Agent</th><th>Operation</th><th>Change</th><th>Status</th></tr></thead><tbody>{run.tms.writebacks.map((w, i) => <tr key={`${w.booking_ref}-${i}`}><td className="font-mono">{w.booking_ref}</td><td>{w.agent}</td><td>{w.operation}</td><td>{w.changes.map(c => `${c.field}: ${"from" in c ? c.from : "—"} → ${c.to}`).join(" · ")}</td><td><Badge tone="blue">Queued — not written</Badge></td></tr>)}</tbody></table></div><div className="divide-y divide-border sm:hidden">{run.tms.writebacks.map((w,i)=><div key={`${w.booking_ref}-${i}`} className="p-4"><div className="flex items-center justify-between gap-2"><span className="font-mono text-xs font-semibold">{w.booking_ref}</span><Badge tone={toneFor(w.severity??"demo")}>{w.severity??"Queued"}</Badge></div><p className="mt-2 truncate text-sm">{w.changes.map(c=>`${c.field}: ${"from" in c?c.from:"—"} → ${c.to}`).join(" · ")}</p><div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground"><span>{w.agent}</span><Badge tone="blue">Queued — not written</Badge></div></div>)}</div></Card></div>
    {!connection && <p className="text-center text-xs text-muted-foreground">No vendor, no credential, no endpoint — nothing is ever written.</p>}
  </div>;
}

type Tab = "file" | "api" | "writeback";
function ConnectPanel() {
  const { connection, applyConnection } = useApp();
  const [tab, setTab] = useState<Tab>("file"); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ result: ConnectResult; body: ConnectBody; recorded?: boolean } | null>(null);
  const [api, setApi] = useState({ url: connection?.kind==="api"?connection.url:"", token: connection?.kind==="api"?connection.token:"", auth_header: connection?.auth_header??"Authorization", records_path: connection?.kind==="api"?connection.records_path??"":"" });
  const [wb, setWb] = useState({ writeback_url: connection?.writeback_url??"", token: connection?.token??"", auth_header: connection?.auth_header??"Authorization" });
  const [drag, setDrag] = useState(false); const fileRef = useRef<HTMLInputElement>(null);
  const wbUrl = wb.writeback_url.trim();
  const wbValid = !wbUrl || /^https:\/\//i.test(wbUrl);

  async function connect(body: ConnectBody, fallback?: ConnectResult) {
    setBusy(true); setError(""); setPreview(null);
    const full = { ...body, ...(wbUrl ? { writeback_url: wbUrl } : {}) } as ConnectBody;
    try { setPreview({ result: await connectTms(full), body: full }); }
    catch (e) { if (fallback) setPreview({ result: { ...fallback, writeback_url: wbUrl || null }, body: full, recorded: true }); else setError(`The TMS connection could not be checked right now (${e instanceof Error ? e.message : "network error"}). Nothing was changed.`); }
    finally { setBusy(false); }
  }
  async function onFile(f?: File | null) { if (!f) return; const content = await f.text(); await connect({ kind: "file", filename: f.name, content }); }
  async function trySample() { try { const content = await getSampleCsv(); await connect({ kind: "file", filename: "sample_tms_export.csv", content }); } catch { await connect({ kind: "file", filename: "sample_tms_export.csv", content: "" }, recordedSampleConnection as unknown as ConnectResult); } }
  async function use() {
    if (!preview) return; const r = preview.result; let c: TmsConnection;
    if (r.kind === "api" && preview.body.kind === "api") c = { kind: "api", name: r.name, source: r.source, url: preview.body.url, token: preview.body.token, auth_header: preview.body.auth_header, records_path: preview.body.records_path, writeback_url: r.writeback_url ?? (wbUrl || null) };
    else c = { kind: "file", name: r.name, source: r.source, read_at: r.read_at, bookings: r.bookings, writeback_url: r.writeback_url ?? (wbUrl || null), token: wb.token || undefined, auth_header: wb.auth_header || undefined };
    setPreview(null); await applyConnection(c);
  }

  return <Card className="min-w-0 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><SectionHead title="Connect your TMS" caption={connection ? `Using ${connection.name}` : "Read your own bookings. Nothing changes until you choose “Use this TMS”."} />
      {connection && <Button variant="outline" onClick={() => void applyConnection(null)}>Disconnect – back to the demo book</Button>}</div>
    <div className="mb-5 flex max-w-full flex-wrap rounded-lg bg-muted p-1 sm:flex-nowrap">{([["file", "Upload an export"], ["api", "Connect an API"], ["writeback", "Write-back (optional)"]] as const).map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`scenario-option shrink-0 ${tab === id ? "scenario-option-active" : ""}`}>{label}</button>)}</div>

    {tab === "file" && <div>
      <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); void onFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()} className={`flex cursor-pointer flex-col items-center rounded-xl border border-dashed p-8 text-center ${drag ? "border-foreground bg-muted" : "border-border"}`}>
        <Upload className="size-5 text-muted-foreground" /><p className="mt-2 text-sm font-medium">Drop a .csv or .json export, or pick a file</p><p className="mt-1 text-xs text-muted-foreground">Read in your browser and checked before anything changes.</p>
        <input ref={fileRef} type="file" accept=".csv,.json,text/csv,application/json" className="hidden" onChange={e => void onFile(e.target.files?.[0])} />
      </div>
      <Button variant="outline" className="mt-3" disabled={busy} onClick={() => void trySample()}>Try the sample export</Button>
    </div>}
    {tab === "api" && <form onSubmit={e => { e.preventDefault(); void connect({ kind: "api", url: api.url.trim(), token: api.token, auth_header: api.auth_header || "Authorization", ...(api.records_path.trim() ? { records_path: api.records_path.trim() } : {}) }); }}>
      <label className="form-label">Endpoint URL<input required type="url" pattern="https://.*" value={api.url} onChange={e => setApi({ ...api, url: e.target.value })} className="form-control" placeholder="https://tms.example.com/api/bookings" /></label>
      <div className="grid gap-x-4 sm:grid-cols-2"><label className="form-label">Token<input type="password" autoComplete="off" value={api.token} onChange={e => setApi({ ...api, token: e.target.value })} className="form-control" /></label>
        <label className="form-label">Auth header<input value={api.auth_header} onChange={e => setApi({ ...api, auth_header: e.target.value })} className="form-control" /></label></div>
      <label className="form-label">Records path (optional)<input value={api.records_path} onChange={e => setApi({ ...api, records_path: e.target.value })} className="form-control" placeholder="data.bookings" /></label>
      <div className="flex flex-wrap items-center gap-3"><Button type="submit" disabled={busy || !/^https:\/\//i.test(api.url.trim())}>Check this endpoint</Button><ConnectionTest body={{kind:"api",url:api.url.trim(),token:api.token,auth_header:api.auth_header||"Authorization",records_path:api.records_path.trim()||undefined}} /></div>
    </form>}
    {tab === "writeback" && <div>
      <p className="mb-4 text-xs text-muted-foreground">Each change you approve is sent there, one at a time. Leave empty to export approved changes and import them yourself.</p>
      <label className="form-label">Write-back URL<input type="url" value={wb.writeback_url} onChange={e => setWb({ ...wb, writeback_url: e.target.value })} className="form-control" placeholder="https://tms.example.com/api/changes" /></label>
      {!wbValid && <p className="-mt-2 mb-3 text-xs text-state-red">The write-back URL must start with https://</p>}
      <div className="grid gap-x-4 sm:grid-cols-2"><label className="form-label">Token<input type="password" autoComplete="off" value={wb.token} onChange={e => setWb({ ...wb, token: e.target.value })} className="form-control" /></label>
        <label className="form-label">Auth header<input value={wb.auth_header} onChange={e => setWb({ ...wb, auth_header: e.target.value })} className="form-control" /></label></div>
      <p className="mb-3 text-xs text-muted-foreground">Set this before you upload an export or check an endpoint; it is saved with the connection.</p><ConnectionTest body={{kind:"writeback",url:wb.writeback_url.trim(),token:wb.token,auth_header:wb.auth_header||"Authorization"}} />
    </div>}

    {busy && <p className="mt-4 text-xs text-muted-foreground">Reading your TMS…</p>}
    {error && <p className="mt-4 rounded-lg bg-state-red-soft p-3 text-xs text-state-red">{error}</p>}
    {preview && <ConnectPreview p={preview} onUse={() => void use()} onCancel={() => setPreview(null)} />}
  </Card>;
}

export function ConnectPreview({ p, onUse, onCancel, dismissLabel = "Cancel" }: { p: { result: ConnectResult; recorded?: boolean }; onUse: () => void; onCancel: () => void; dismissLabel?: string }) {
  const r = p.result;
  return <div className="mt-6 space-y-4 border-t border-border pt-5">
    <div className="flex flex-wrap items-center gap-2"><h3 className="min-w-0 break-words text-sm font-semibold">{r.name}</h3>{p.recorded && <Badge tone="amber">Recorded</Badge>}</div>
    {r.error && <p className="rounded-lg bg-state-red-soft p-3 text-xs text-state-red">{r.error}</p>}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><Metric label="Rows read" value={r.rows_read ?? 0} /><Metric label="Bookings covered" value={r.bookings?.length ?? 0} /><Metric label="Not covered" value={r.not_covered?.length ?? 0} /></div>
    {r.mapping?.length > 0 && <div className="rounded-lg border border-border"><div className="hidden sm:block"><table><thead><tr><th>Your column</th><th>SQRlane field</th><th>Used for</th></tr></thead><tbody>{r.mapping.map(m => <tr key={m.column}><td className="font-mono">{m.column}</td><td className="font-mono">{m.field}</td><td>{m.used_for}</td></tr>)}</tbody></table></div><div className="divide-y divide-border sm:hidden">{r.mapping.map(m=><div key={m.column} className="p-3"><div className="flex items-center gap-2 text-xs"><span className="font-mono font-semibold">{m.column}</span><span>→</span><span className="font-mono">{m.field}</span></div><p className="mt-1 text-xs text-muted-foreground">{m.used_for}</p></div>)}</div></div>}
    {r.not_covered?.length > 0 && <div><p className="stat-label mb-2">Not covered</p>{r.not_covered.map((n, i) => <p key={i} className="break-words text-xs"><span className="font-mono">Row {n.row}{n.ref ? ` · ${n.ref}` : ""}</span> — <span className="text-muted-foreground">{n.reason}</span></p>)}</div>}
    {r.unmapped_columns?.length > 0 && <div><p className="stat-label mb-2">Unmapped columns</p><div className="flex flex-wrap gap-1.5">{r.unmapped_columns.map(c => <Badge key={c}>{c}</Badge>)}</div></div>}
    {r.warnings?.length > 0 && <ul className="space-y-1">{r.warnings.map((w, i) => <li key={i} className="text-xs text-state-amber">{w}</li>)}</ul>}
    <div className="flex flex-wrap gap-2"><Button disabled={!r.ok && !p.recorded} onClick={onUse}>Use this TMS</Button><Button variant="outline" onClick={onCancel}>{dismissLabel}</Button></div>
  </div>;
}

/* ------------------------------ Connection test ------------------------------ */
export function ConnectionTest({ body, onVerified }: { body: TmsTestBody; onVerified?: () => void }) {
  const [busy, setBusy] = useState(false); const [result, setResult] = useState<TmsTestResult | null>(null);
  const valid = /^https:\/\//i.test(body.url);
  async function run() { setBusy(true); try { const next = await testTms(body); setResult(next); if (next.ok) { saveVerification(body.kind, body.url, next); onVerified?.(); } } catch (e) { setResult({ ok:false, error:e instanceof Error?e.message:"Connection test failed" }); } finally { setBusy(false); } }
  return <div className="flex flex-wrap items-center gap-3"><Button variant="outline" disabled={!valid||busy} onClick={() => void run()}>{busy?"Testing…":"Test connection"}</Button>{result&&<p className={`text-xs ${result.ok?"text-state-green":"text-state-red"}`}>{result.ok?`${result.host??hostOf(body.url)} · ${result.detail??"Connection verified"}`:result.error}</p>}</div>;
}

/* ------------------------------ Approvals ------------------------------ */
type QueueSearch = { booking?: string; kind?: string; agent?: string; severity?: string; age?: string; sort?: string; tab?: string };
export function ApprovalsPage() {
  const { run, workflow, approved, approve, connection } = useApp();
  const navigate = useNavigate(); const search = useSearch({ strict:false }) as QueueSearch;
  const [tab, setTab] = useState<"awaiting"|"approved"|"all"|"history">(search.tab==="history"?"history":"awaiting"); const [selected, setSelected] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, PushResult>>({}); const [sending, setSending] = useState(false);
  const [approver, setApprover] = useState(""); const [nameDraft, setNameDraft] = useState(""); const [askingName, setAskingName] = useState(false); const [pendingKeys, setPendingKeys] = useState<string[]>([]); const [history, setHistory] = useState<ApprovalLogEntry[]>([]); const nameDialog=useRef<HTMLDivElement>(null);
  const pushUrl = connection?.writeback_url || ""; const runId = run.ran_at ?? "not-run";
  useEffect(()=>{const name=loadApprover();setApprover(name);setNameDraft(name);setHistory(loadApprovalLog())},[]);
  useEffect(()=>{if(!askingName)return;const handler=(e:KeyboardEvent)=>{if(e.key==="Escape"){setAskingName(false);return}if(e.key!=="Tab")return;const items=[...(nameDialog.current?.querySelectorAll<HTMLElement>('button,input,[tabindex]:not([tabindex="-1"])')??[])];const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}};addEventListener("keydown",handler);return()=>{removeEventListener("keydown",handler);document.getElementById("approver-trigger")?.focus()}},[askingName]);
  const all = useMemo(() => approvalRows(run, workflow), [run, workflow]);
  const byKey = useMemo(() => new Map(all.map(x => [x.key, x])), [all]);
  const agents = [...new Set(all.map(x=>x.agent))].sort(); const bookings=[...new Set(all.map(x=>x.booking))].sort();
  const filtered = all.filter(row => (!search.booking||row.booking===search.booking)&&(!search.kind||row.kind===search.kind)&&(!search.agent||row.agent===search.agent)&&(!search.severity||row.severity===search.severity)&&(!search.age||search.age==="any"||(search.age==="15"&&ageMs(row.queued_at)>15*60000)||(search.age==="60"&&ageMs(row.queued_at)>60*60000))).filter(row=>tab==="all"||(tab==="approved")===approved.has(row.key));
  const shown=[...filtered].sort((a,b)=>search.sort==="age"?ageMs(b.queued_at)-ageMs(a.queued_at):search.sort==="booking"?a.booking.localeCompare(b.booking):severityRank(b.severity)-severityRank(a.severity)||ageMs(b.queued_at)-ageMs(a.queued_at));
  const visibleAwaiting=shown.filter(row=>!approved.has(row.key));
  function setSearch(key:keyof QueueSearch,value:string){const next:QueueSearch={...search};if(value)next[key]=value;else delete next[key];void navigate({to:"/approvals",search:next,replace:true})}
  function toggle(key:string){setSelected(old=>{const next=new Set(old);next.has(key)?next.delete(key):next.add(key);return next})}
  function record(row:ApprovalRow, resultStatus:string, destination:string) { const entry={key:row.key,run_id:runId,booking:row.booking,agent:row.agent,kind:row.kind,summary:rowSummary(row),approver,approved_at:new Date().toISOString(),destination,result_status:resultStatus};saveApproval(entry);setHistory(loadApprovalLog()); }
  async function approveKeys(keys:string[]){if(!approver){setPendingKeys(keys);setAskingName(true);return}setSending(true);for(const key of keys){const row=byKey.get(key);if(!row||approved.has(key))continue;if(row.op&&pushUrl){let result:PushResult;try{result=await pushWriteback({operation:row.op,writeback_url:pushUrl,token:connection?.token,auth_header:connection?.auth_header})}catch(e){result={ok:false,error:e instanceof Error?e.message:"Request failed"}}setResults(old=>({...old,[key]:result}));if(result.ok){approve([key]);record(row,`HTTP ${result.status}`,result.host)}}else{approve([key]);record(row,"Approved",connection&&!pushUrl?"exported":"local only")}}setSelected(new Set());setSending(false)}
  function confirmName(){const value=nameDraft.trim();if(!value)return;saveApprover(value);setApprover(value);setAskingName(false);if(pendingKeys.length){const keys=[...pendingKeys];setPendingKeys([]);window.setTimeout(()=>void approveWithName(keys,value),0)}}
  async function approveWithName(keys:string[],name:string){setSending(true);for(const key of keys){const row=byKey.get(key);if(!row||approved.has(key))continue;if(row.op&&pushUrl){let result:PushResult;try{result=await pushWriteback({operation:row.op,writeback_url:pushUrl,token:connection?.token,auth_header:connection?.auth_header})}catch(e){result={ok:false,error:e instanceof Error?e.message:"Request failed"}}setResults(old=>({...old,[key]:result}));if(result.ok){approve([key]);const entry={key:row.key,run_id:runId,booking:row.booking,agent:row.agent,kind:row.kind,summary:rowSummary(row),approver:name,approved_at:new Date().toISOString(),destination:result.host,result_status:`HTTP ${result.status}`};saveApproval(entry)}}else{approve([key]);const entry={key:row.key,run_id:runId,booking:row.booking,agent:row.agent,kind:row.kind,summary:rowSummary(row),approver:name,approved_at:new Date().toISOString(),destination:connection&&!pushUrl?"exported":"local only",result_status:"Approved"};saveApproval(entry)}}setHistory(loadApprovalLog());setSelected(new Set());setSending(false)}
  const approvedOps=all.filter(row=>row.op&&approved.has(row.key)).flatMap(row=>row.op?[row.op]:[]);
  function exportApproved(){const rows=approvedOps.flatMap(op=>op.changes.map(c=>({booking_ref:op.booking_ref,agent:op.agent,record:op.record,field:c.field,from:"from" in c?String(c.from??""):"",to:String(c.to??""),reason:op.reason})));exportCsv("sqrlane-approved-changes.csv",rows);download("sqrlane-approved-changes.json",JSON.stringify(approvedOps,null,2),"application/json");markOnboarding("change")}
  const visibleHistory=history.filter(entry=>entry.run_id===runId&&(!search.booking||entry.booking===search.booking)).sort((a,b)=>Date.parse(b.approved_at)-Date.parse(a.approved_at));
  return <div className="space-y-5">
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><div className="flex min-w-0 flex-wrap rounded-lg bg-muted p-1">{(["awaiting","approved","all","history"] as const).map(value=><button key={value} onClick={()=>{setTab(value);setSelected(new Set())}} className={`scenario-option shrink-0 capitalize ${tab===value?"scenario-option-active":""}`}>{value}</button>)}</div><Button id="approver-trigger" variant="outline" className="shrink-0" onClick={()=>{setNameDraft(approver);setAskingName(true)}}><Pencil className="size-3.5"/>{approver||"Your name"}</Button></div>
    {tab==="history"?<HistoryView rows={visibleHistory} booking={search.booking??""} bookings={bookings} setBooking={value=>setSearch("booking",value)}/>:<>
      <Card className="p-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Filter label="Booking" value={search.booking??""} onChange={v=>setSearch("booking",v)} options={bookings}/><Filter label="Kind" value={search.kind??""} onChange={v=>setSearch("kind",v)} options={["Email draft","TMS write-back","Desk output"]}/><Filter label="Agent" value={search.agent??""} onChange={v=>setSearch("agent",v)} options={agents}/><Filter label="Severity" value={search.severity??""} onChange={v=>setSearch("severity",v)} options={["critical","high","medium","low","none"]}/><Filter label="Age" value={search.age??"any"} onChange={v=>setSearch("age",v)} options={["any","15","60"]} names={{any:"Any",15:">15 min",60:">1 h"}}/><Filter label="Sort" value={search.sort??"severity"} onChange={v=>setSearch("sort",v)} options={["severity","age","booking"]}/></div></Card>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><label className="flex min-w-0 items-center gap-2 text-xs"><input type="checkbox" className="size-4 accent-primary" checked={visibleAwaiting.length>0&&visibleAwaiting.every(row=>selected.has(row.key))} onChange={e=>setSelected(e.target.checked?new Set(visibleAwaiting.map(row=>row.key)):new Set())}/>Select all visible <span className="text-muted-foreground">({visibleAwaiting.length})</span></label><div className="flex shrink-0 gap-2">{connection&&!pushUrl&&<Button variant="outline" disabled={!approvedOps.length} onClick={exportApproved}><Download className="size-4"/><span className="hidden sm:inline">Export approved changes</span></Button>}<Button disabled={!selected.size||sending} onClick={()=>void approveKeys([...selected])}><Check className="size-4"/>{sending?"Working…":`Approve ${selected.size}`}</Button></div></div>
      {pushUrl&&<p className="text-xs text-muted-foreground">Approving a TMS write-back sends that one operation to {hostOf(pushUrl)}. Drafts are only marked approved — nothing is mailed.</p>}
      {shown.length?<div className="space-y-3">{shown.map(row=><QueueRow key={row.key} row={row} done={approved.has(row.key)} selected={selected.has(row.key)} sending={sending} result={results[row.key]} toggle={()=>toggle(row.key)}/>)}</div>:<Card className="p-10 text-center"><Check className="mx-auto size-6 text-state-green"/><p className="mt-3 text-sm font-medium">Nothing waiting for you.</p><p className="mt-1 text-xs text-muted-foreground">Run a scenario to see decisions here.</p></Card>}
    </>}
    {askingName&&<div ref={nameDialog} role="dialog" aria-modal="true" aria-label="Your name" className="fixed inset-0 z-[80] grid place-items-center bg-overlay p-4"><Card className="w-full max-w-sm p-5"><SectionHead title="Your name" caption="Saved in this browser and attached to each approval."/><input autoFocus className="form-control" value={nameDraft} onChange={e=>setNameDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")confirmName()}}/><div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={()=>setAskingName(false)}>Cancel</Button><Button disabled={!nameDraft.trim()} onClick={confirmName}>Save</Button></div></Card></div>}
  </div>
}
function Filter({label,value,onChange,options,names}:{label:string;value:string;onChange:(v:string)=>void;options:string[];names?:Record<string,string>}){return <label className="text-[10px] font-semibold uppercase text-muted-foreground">{label}<select className="form-control mt-1 normal-case" value={value} onChange={e=>onChange(e.target.value)}><option value="">All</option>{options.map(x=><option key={x} value={x}>{names?.[x]??x}</option>)}</select></label>}
function QueueRow({row,done,selected,sending,result,toggle}:{row:ApprovalRow;done:boolean;selected:boolean;sending:boolean;result?:PushResult | undefined;toggle:()=>void}){return <Card className="overflow-hidden"><details><summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-semibold">{row.booking}</span><Badge tone={row.severity==="none"?"neutral":toneFor(row.severity)}>{row.severity}</Badge><span className="text-[10px] text-muted-foreground">{ageLabel(row.queued_at)}</span></div><p className="mt-2 truncate text-sm font-medium">{row.title}</p><p className="mt-1 text-xs text-muted-foreground">{row.kind} · {row.agent}</p></div><ChevronDown className="size-4 shrink-0 text-muted-foreground"/></summary><div className="border-t border-border bg-muted/40 p-4"><p className="stat-label mb-3">Full proposed change</p>{row.op?<div className="space-y-2">{row.op.changes.map((change,index)=><div key={`${change.field}-${index}`} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-xs"><span className="min-w-0 break-words rounded-md bg-card p-2">{"from" in change?String(change.from??"—"):"—"}</span><span>→</span><span className="min-w-0 break-words rounded-md bg-card p-2">{String(change.to??"—")}</span><span className="col-span-3 text-[10px] text-muted-foreground">{change.field}</span></div>)}</div>:<p className="whitespace-pre-wrap text-xs leading-5">{row.body??row.title}</p>}<label className="mt-4 flex items-center gap-2 text-xs font-medium"><input type="checkbox" className="size-4 accent-primary" checked={selected} disabled={done||sending} onChange={toggle}/>{done?"Approved":"Select for approval"}</label>{result&&<p className={`mt-2 text-xs ${result.ok?"text-state-green":"text-state-red"}`}>{result.ok?`Sent to ${result.host} · HTTP ${result.status}`:result.error}</p>}</div></details></Card>}
function HistoryView({rows,booking,bookings,setBooking}:{rows:ApprovalLogEntry[];booking:string;bookings:string[];setBooking:(v:string)=>void}){function exportHistory(){exportCsv("sqrlane-approval-history.csv",rows)}return <div className="space-y-4"><Card className="p-4"><p className="text-xs font-medium">Kept in this browser. SQRlane has no accounts or database in this build, so this history is not shared with colleagues.</p><div className="mt-4 flex flex-wrap items-end justify-between gap-3"><div className="w-56"><Filter label="Booking" value={booking} onChange={setBooking} options={bookings}/></div><Button variant="outline" disabled={!rows.length} onClick={exportHistory}><Download className="size-4"/>Export CSV</Button></div></Card>{rows.length?rows.map(entry=><Card key={`${entry.run_id}-${entry.key}`} className="p-4"><div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"><div className="min-w-0"><p className="font-mono text-xs font-semibold">{entry.booking}</p><p className="mt-1 text-sm">{entry.summary}</p><p className="mt-2 text-xs text-muted-foreground">{entry.agent} · {entry.kind} · {entry.approver} · {new Date(entry.approved_at).toLocaleString()}</p></div><Badge tone={entry.result_status.startsWith("HTTP")||entry.result_status==="Approved"?"green":"neutral"}>{entry.result_status}</Badge></div><p className="mt-2 text-xs text-muted-foreground">Destination: {entry.destination}</p></Card>):<Card className="p-10 text-center"><p className="text-sm font-medium">No approval history for this run.</p></Card>}</div>}
function exportCsv(name:string,rows:Array<Record<string,unknown>>){if(!rows.length)return;const columns=Object.keys(rows[0] ?? {});const escape=(value:unknown)=>{const text=String(value??"");return /[",\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text};download(name,[columns.join(","),...rows.map(row=>columns.map(key=>escape(row[key])).join(","))].join("\n"),"text/csv")}
function download(name: string, content: string, type: string) { try { const url=URL.createObjectURL(new Blob([content],{type}));const anchor=document.createElement("a");anchor.href=url;anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000)} catch { /* download unavailable */ } }
