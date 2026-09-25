import { useMemo, useRef, useState } from "react";
import { Check, Download, Upload } from "lucide-react";
import { recordedSampleConnection } from "@/data/ask-fixtures";
import { connectTms, getSampleCsv, hostOf, pushWriteback, type ConnectBody, type ConnectResult, type PushResult, type TmsConnection, type Writeback } from "@/lib/api";
import { bookingForOutput } from "@/lib/presentation";
import { Badge, Button, Card } from "@/components/ui";
import { useApp } from "./app-context";
import { SectionHead } from "./operations-pages";
import { Metric } from "./system-pages";

/* ------------------------------ TMS link ------------------------------ */
export function TmsPage() {
  const { run, connection } = useApp();
  const entries = Object.entries(run.tms.queued_by_agent); const max = Math.max(...entries.map(([, v]) => v), 1);
  return <div className="space-y-5">
    <Card className="p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="stat-label">Connector</p><h2 className="mt-2 break-words text-lg font-semibold">{run.tms.connector} · {run.tms.status}</h2><p className="mt-1 text-xs text-muted-foreground">{run.tms.honesty}</p></div><Badge tone={connection ? "green" : "blue"}>{connection ? "CONNECTED" : "DEMO"}</Badge></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3"><Metric label="Bookings read" value={run.tms.bookings_read} /><Metric label="Changes queued" value={run.tms.queued} /><Metric label="Bookings affected" value={run.tms.bookings_affected} /></div></Card>
    <ConnectPanel />
    <div className="grid gap-5 xl:grid-cols-[.6fr_1.4fr]"><Card className="p-5"><SectionHead title="Queued by agent" />{entries.map(([agent, value]) => <div key={agent} className="mb-4"><div className="mb-1 flex justify-between text-xs"><span>{agent}</span><span className="font-mono">{value}</span></div><div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-state-blue" style={{ width: `${value / max * 100}%` }} /></div></div>)}</Card>
      <Card className="min-w-0 overflow-hidden"><div className="p-5"><SectionHead title="Write-back queue" /></div><div className="table-wrap"><table><thead><tr><th>Booking</th><th>Agent</th><th>Operation</th><th>Change</th><th>Status</th></tr></thead><tbody>{run.tms.writebacks.map((w, i) => <tr key={`${w.booking_ref}-${i}`}><td className="font-mono">{w.booking_ref}</td><td>{w.agent}</td><td>{w.operation}</td><td>{w.changes.map(c => `${c.field}: ${"from" in c ? c.from : "—"} → ${c.to}`).join(" · ")}</td><td><Badge tone="blue">Queued — not written</Badge></td></tr>)}</tbody></table></div></Card></div>
    {!connection && <p className="text-center text-xs text-muted-foreground">No vendor, no credential, no endpoint — nothing is ever written.</p>}
  </div>;
}

type Tab = "file" | "api" | "writeback";
function ConnectPanel() {
  const { connection, applyConnection } = useApp();
  const [tab, setTab] = useState<Tab>("file"); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ result: ConnectResult; body: ConnectBody; recorded?: boolean } | null>(null);
  const [api, setApi] = useState({ url: "", token: "", auth_header: "Authorization", records_path: "" });
  const [wb, setWb] = useState({ writeback_url: "", token: "", auth_header: "Authorization" });
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
    <div className="mb-5 flex max-w-full overflow-x-auto rounded-lg bg-muted p-1">{([["file", "Upload an export"], ["api", "Connect an API"], ["writeback", "Write-back (optional)"]] as const).map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`scenario-option shrink-0 ${tab === id ? "scenario-option-active" : ""}`}>{label}</button>)}</div>

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
      <Button type="submit" disabled={busy || !/^https:\/\//i.test(api.url.trim())}>Check this endpoint</Button>
    </form>}
    {tab === "writeback" && <div>
      <p className="mb-4 text-xs text-muted-foreground">Each change you approve is sent there, one at a time. Leave empty to export approved changes and import them yourself.</p>
      <label className="form-label">Write-back URL<input type="url" value={wb.writeback_url} onChange={e => setWb({ ...wb, writeback_url: e.target.value })} className="form-control" placeholder="https://tms.example.com/api/changes" /></label>
      {!wbValid && <p className="-mt-2 mb-3 text-xs text-state-red">The write-back URL must start with https://</p>}
      <div className="grid gap-x-4 sm:grid-cols-2"><label className="form-label">Token<input type="password" autoComplete="off" value={wb.token} onChange={e => setWb({ ...wb, token: e.target.value })} className="form-control" /></label>
        <label className="form-label">Auth header<input value={wb.auth_header} onChange={e => setWb({ ...wb, auth_header: e.target.value })} className="form-control" /></label></div>
      <p className="text-xs text-muted-foreground">Set this before you upload an export or check an endpoint; it is saved with the connection.</p>
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
    {r.mapping?.length > 0 && <div className="table-wrap rounded-lg border border-border"><table><thead><tr><th>Your column</th><th>SQRlane field</th><th>Used for</th></tr></thead><tbody>{r.mapping.map(m => <tr key={m.column}><td className="font-mono">{m.column}</td><td className="font-mono">{m.field}</td><td>{m.used_for}</td></tr>)}</tbody></table></div>}
    {r.not_covered?.length > 0 && <div><p className="stat-label mb-2">Not covered</p>{r.not_covered.map((n, i) => <p key={i} className="break-words text-xs"><span className="font-mono">Row {n.row}{n.ref ? ` · ${n.ref}` : ""}</span> — <span className="text-muted-foreground">{n.reason}</span></p>)}</div>}
    {r.unmapped_columns?.length > 0 && <div><p className="stat-label mb-2">Unmapped columns</p><div className="flex flex-wrap gap-1.5">{r.unmapped_columns.map(c => <Badge key={c}>{c}</Badge>)}</div></div>}
    {r.warnings?.length > 0 && <ul className="space-y-1">{r.warnings.map((w, i) => <li key={i} className="text-xs text-state-amber">{w}</li>)}</ul>}
    <div className="flex flex-wrap gap-2"><Button disabled={!r.ok && !p.recorded} onClick={onUse}>Use this TMS</Button><Button variant="outline" onClick={onCancel}>{dismissLabel}</Button></div>
  </div>;
}

/* ------------------------------ Approvals ------------------------------ */
type Row = { key: string; booking: string; kind: "Draft" | "Write-back"; title: string; agent: string; op?: Writeback };
export function ApprovalsPage() {
  const { run, workflow, approved, approve, connection } = useApp();
  const [filter, setFilter] = useState<"awaiting" | "approved" | "all">("awaiting"); const [selected, setSelected] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, PushResult>>({}); const [sending, setSending] = useState(false);
  const pushUrl = connection?.writeback_url || "";
  const all = useMemo(() => {
    const items: Row[] = [];
    run.shipments.forEach(s => s.drafts.forEach((d, i) => items.push({ key: `shipment-draft-${s.id}-${i}`, booking: s.id, kind: "Draft", title: d.subject, agent: "Comms Worker" })));
    run.tms.writebacks.forEach((w, i) => items.push({ key: `tms-${w.booking_ref}-${i}`, booking: w.booking_ref, kind: "Write-back", title: w.reason, agent: w.agent, op: w }));
    workflow.outputs.forEach(o => items.push({ key: `desk-${o.id}`, booking: bookingForOutput(o), kind: o.kind === "mail" ? "Draft" : "Write-back", title: o.subject ?? o.reason, agent: o.worker }));
    return items;
  }, [run, workflow]);
  const byKey = useMemo(() => new Map(all.map(x => [x.key, x])), [all]);
  const shown = all.filter(x => filter === "all" || (filter === "approved") === approved.has(x.key));
  const grouped = shown.reduce<Record<string, Row[]>>((g, item) => { (g[item.booking] ??= []).push(item); return g }, {});
  function toggle(k: string) { setSelected(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n }) }

  async function approveKeys(keys: string[]) {
    if (!pushUrl) { approve(keys); return; }
    setSending(true);
    const plain = keys.filter(k => !byKey.get(k)?.op); if (plain.length) approve(plain);
    for (const k of keys) {
      const op = byKey.get(k)?.op; if (!op) continue;
      let res: PushResult;
      try { res = await pushWriteback({ operation: op, writeback_url: pushUrl, token: connection?.token, auth_header: connection?.auth_header }); }
      catch (e) { res = { ok: false, error: e instanceof Error ? e.message : "Request failed" }; }
      setResults(r => ({ ...r, [k]: res }));
      if (res.ok) approve([k]);
    }
    setSending(false);
  }
  const approvedOps = all.filter(x => x.op && approved.has(x.key)).map(x => x.op!);
  function exportApproved() {
    const rows = approvedOps.flatMap(o => o.changes.map(c => ({ booking_ref: o.booking_ref, agent: o.agent, record: o.record, field: c.field, from: "from" in c ? String(c.from ?? "") : "", to: String(c.to ?? ""), reason: o.reason })));
    const esc = (v: string) => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    const cols = ["booking_ref", "agent", "record", "field", "from", "to", "reason"] as const;
    const csv = [cols.join(","), ...rows.map(r => cols.map(c => esc(r[c])).join(","))].join("\n");
    download("sqrlane-approved-changes.json", JSON.stringify(approvedOps, null, 2), "application/json");
    download("sqrlane-approved-changes.csv", csv, "text/csv");
  }

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex rounded-lg bg-muted p-1">{(["awaiting", "approved", "all"] as const).map(x => <button key={x} onClick={() => setFilter(x)} className={`scenario-option capitalize ${filter === x ? "scenario-option-active" : ""}`}>{x}</button>)}</div>
      <div className="flex flex-wrap gap-2">{connection && !pushUrl && <Button variant="outline" disabled={!approvedOps.length} onClick={exportApproved}><Download className="size-4" />Export approved changes</Button>}
        <Button disabled={!selected.size || sending} onClick={() => { const k = [...selected]; setSelected(new Set()); void approveKeys(k); }}><Check className="size-4" />{sending ? "Sending…" : `Approve ${selected.size}`}</Button></div></div>
    {pushUrl && <p className="text-xs text-muted-foreground">Approving a TMS write-back sends that one change to {hostOf(pushUrl)}. Drafts are only marked approved — nothing is mailed.</p>}
    {Object.keys(grouped).length ? Object.entries(grouped).map(([booking, items]) => <Card key={booking} className="overflow-hidden"><div className="border-b border-border px-5 py-3"><span className="font-mono text-xs font-semibold">{booking}</span></div>
      {items.map(item => { const res = results[item.key]; const done = approved.has(item.key); return <div key={item.key} className="border-b border-border px-5 py-4 last:border-0 hover:bg-muted"><label className="flex cursor-pointer items-center gap-3">
        <input type="checkbox" checked={selected.has(item.key)} disabled={done || sending} onChange={() => toggle(item.key)} className="size-4 shrink-0 accent-primary" />
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.agent}</p></div>
        <Badge tone={done ? "green" : item.kind === "Draft" ? "amber" : "blue"} className="shrink-0">{done ? "Approved" : item.kind === "Draft" ? "Draft ready · waits for your approval" : "Queued — not written"}</Badge></label>
        {res && <p className={`mt-2 pl-7 text-xs ${res.ok ? "text-state-green" : "text-state-red"}`}>{res.ok ? `Sent to ${res.host} · HTTP ${res.status}` : res.error}</p>}
      </div>; })}</Card>)
      : <Card className="p-10 text-center"><Check className="mx-auto size-6 text-state-green" /><p className="mt-3 text-sm font-medium">Nothing waiting</p><p className="mt-1 text-xs text-muted-foreground">{pushUrl ? "Approved write-backs are sent to your TMS one at a time." : "Approvals are local only."} Run a scenario to see decisions here.</p></Card>}
  </div>;
}
function download(name: string, content: string, type: string) {
  try { const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); } catch { /* download unavailable */ }
}
