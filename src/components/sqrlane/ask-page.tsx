import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, Check, ChevronDown, Copy } from "lucide-react";
import { recordedAnswers } from "@/data/ask-fixtures";
import { askDesk, hostOf, type AskAnswer } from "@/lib/api";
import { Badge, Button, Card, Tooltip } from "@/components/ui";
import { useApp } from "./app-context";
import { ModeBadge, SectionHead } from "./operations-pages";

type Entry = { id: number; question: string; answer?: AskAnswer; recorded?: boolean; unreachable?: boolean };
const recordedQuestions = Object.keys(recordedAnswers);
const MCP_URL = "https://www.sqrlane.com/mcp";

function findRecorded(q: string): AskAnswer | undefined {
  const key = recordedQuestions.find(k => k.toLowerCase() === q.trim().toLowerCase());
  return key ? (recordedAnswers as unknown as Record<string, AskAnswer>)[key] : undefined;
}

export function AskPage() {
  const { run, connection } = useApp();
  const search = useSearch({ strict: false }) as { q?: string };
  const navigate = useNavigate();
  const [text, setText] = useState(""); const [thread, setThread] = useState<Entry[]>([]); const [busy, setBusy] = useState(false);
  const [examples, setExamples] = useState<string[]>(() => ((run as unknown as { examples?: string[] }).examples ?? recordedQuestions).slice(0, 6));
  const counter = useRef(0); const endRef = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    const q = question.trim(); if (!q || busy) return;
    const id = ++counter.current; setText(""); setBusy(true); setThread(t => [...t, { id, question: q }]);
    let entry: Entry;
    try {
      const answer = await askDesk(q, (run as unknown as { scenario?: { id?: string } | null }).scenario?.id ?? null, connection);
      if (answer.examples?.length) setExamples(answer.examples.slice(0, 6));
      entry = { id, question: q, answer };
    } catch {
      const rec = findRecorded(q);
      entry = rec ? { id, question: q, answer: rec, recorded: true } : { id, question: q, unreachable: true };
    }
    setThread(t => t.map(e => e.id === id ? entry : e)); setBusy(false);
  }
  useEffect(() => { if (search.q) { void ask(search.q); void navigate({ to: "/", search: {}, replace: true }); } }, [search.q]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [thread]);

  return <div className="mx-auto max-w-5xl space-y-6">
    <section className="pt-2 md:pt-6">
      <form onSubmit={e => { e.preventDefault(); void ask(text); }} className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 pl-4 shadow-sm">
        <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void ask(text); } }} rows={2}
          aria-label="Ask the desk" placeholder="Ask the desk anything — a booking, a port, a rate, an invoice, customs, what's waiting for you"
          className="min-w-0 flex-1 resize-none bg-transparent py-2 text-sm outline-none md:text-base" />
        <Button type="submit" aria-label="Ask" disabled={!text.trim() || busy} className="size-10 shrink-0 rounded-xl p-0"><ArrowUp className="size-4" /></Button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">{examples.map(x => <button key={x} onClick={() => void ask(x)} className="ask-chip">{x}</button>)}</div>
    </section>

    {thread.length > 0 && <section className="space-y-5">{thread.map(e => <ThreadEntry key={e.id} entry={e} onAsk={q => void ask(q)} />)}<div ref={endRef} /></section>}

    <div className="grid gap-5 lg:grid-cols-2"><DeskToday /><TmsStatusCard /></div>
    <McpCard />
  </div>;
}

function ThreadEntry({ entry, onAsk }: { entry: Entry; onAsk: (q: string) => void }) {
  const a = entry.answer;
  return <div className="space-y-3">
    <div className="flex justify-end"><p className="max-w-[85%] break-words rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">{entry.question}</p></div>
    {!a && !entry.unreachable && <Card className="flex w-fit items-center gap-1.5 px-4 py-3" ><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /><span className="sr-only">The desk is answering</span></Card>}
    {entry.unreachable && <Card className="p-5"><p className="text-sm font-medium">The desk isn't reachable right now — nothing made up.</p><p className="mt-1 text-xs text-muted-foreground">These recorded questions still have answers:</p><div className="mt-3 flex flex-wrap gap-2">{recordedQuestions.map(q => <button key={q} onClick={() => onAsk(q)} className="ask-chip">{q}</button>)}</div></Card>}
    {a && <Card className="min-w-0 p-5">
      <div className="flex flex-wrap items-center gap-2">
        {a.answered && a.routed_to ? <><span className="worker-pill"><span className={`size-1.5 rounded-full bg-state-${a.routed_to.mode === "live" ? "green" : a.routed_to.mode === "scripted" ? "amber" : "blue"}`} />{a.routed_to.name}<ModeBadge mode={a.routed_to.mode} /></span>
          <Tooltip content={a.route_reason}><span className="cursor-help text-xs text-muted-foreground underline decoration-dotted">routed by {a.routed_by}</span></Tooltip></>
          : <Badge tone="amber">No Worker owns this</Badge>}
        {entry.recorded && <Badge tone="amber" className="ml-auto">Recorded answer</Badge>}
      </div>
      <p className="mt-4 break-words text-sm leading-6">{a.text}</p>
      {a.facts.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{a.facts.map((f, i) => <span key={i} className="rounded-md border border-border bg-muted px-2 py-1 text-xs"><span className="text-muted-foreground">{f.label}</span> <b className="font-mono font-medium">{String(f.value)}</b></span>)}</div>}
      {a.links.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{a.links.map((l, i) => <AnswerLink key={i} link={l} />)}</div>}
      {!a.answered && a.suggestions.length > 0 && <ul className="mt-4 space-y-2 text-sm">{a.suggestions.map((s, i) => { const m = s.match(/["“]([^"”]+\?)["”]/); return <li key={i} className="flex flex-wrap items-center gap-2 text-muted-foreground"><span>{m ? s.replace(m[0], "").trim() : s}</span>{m && <button className="ask-chip" onClick={() => onAsk(m[1])}>{m[1]}</button>}</li>; })}</ul>}
      {a.conversation.length > 0 && <details className="mt-5 border-t border-border pt-4"><summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-medium text-muted-foreground"><ChevronDown className="size-3.5" />How the desk answered ({a.conversation.length} messages)</summary>
        <ol className="mt-3 space-y-2">{a.conversation.map(m => { const row = <li className="rounded-lg border border-border p-3"><div className="flex flex-wrap items-center gap-2 text-xs"><span className="flex size-5 items-center justify-center rounded-full bg-primary font-mono text-[9px] text-primary-foreground">{m.seq}</span><b>{m.from}</b><ArrowRight className="size-3 text-muted-foreground" /><span>{m.to}</span><Badge>{m.kind}</Badge></div><p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{m.text}</p></li>; return m.why ? <Tooltip key={m.seq} content={m.why}>{row}</Tooltip> : <div key={m.seq}>{row}</div>; })}</ol></details>}
      {a.checked_against?.note && <p className="mt-4 text-xs text-muted-foreground">{a.checked_against.note}</p>}
    </Card>}
  </div>;
}

function AnswerLink({ link }: { link: AskAnswer["links"][number] }) {
  const cls = "inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-muted";
  const inner = <>{link.label}<ArrowRight className="size-3" /></>;
  const id = link.id ?? undefined;
  switch (link.view) {
    case "shipments": return <Link to="/shipments" search={{ id }} className={cls}>{inner}</Link>;
    case "desk": return <Link to="/desk" search={{ id }} className={cls}>{inner}</Link>;
    case "approvals": return <Link to="/approvals" className={cls}>{inner}</Link>;
    case "risk": return <Link to="/risk" className={cls}>{inner}</Link>;
    case "tms": return <Link to="/tms" className={cls}>{inner}</Link>;
    default: return null;
  }
}

function DeskToday() {
  const { workflow, run } = useApp(); const s = workflow.stats as Record<string, number>;
  const tmsQueued = workflow.outputs.filter(o => o.kind === "tms").length;
  const flow: Array<[string, number | undefined]> = [["Inbox", s.items], ["Workers", s.routed], ["Playbook check", s.playbook_fixes], ["Your approval", workflow.outputs.length], ["TMS", tmsQueued]];
  const stats: Array<[string, number | undefined]> = [["Mails in", s.items], ["Routed", s.routed], ["Escalated", s.escalations], ["Drafts", s.mails], ["TMS changes queued", tmsQueued], ["Playbook fixes", s.playbook_fixes]];
  void run;
  return <Card className="p-5"><div className="flex items-start justify-between gap-3"><SectionHead title="The desk today" caption="The inbox worked by the Workers" /><Link to="/desk" className="shrink-0 text-xs font-medium hover:underline">Open the desk →</Link></div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{stats.map(([l, v]) => <div key={l} className="rounded-lg bg-muted p-3"><p className="text-[10px] font-semibold uppercase text-muted-foreground">{l}</p><p className="mt-1 font-mono text-xl font-semibold">{v ?? "—"}</p></div>)}</div>
    <div className="mt-5 flex flex-wrap items-center gap-1.5 text-xs">{flow.map(([l, v], i) => <span key={l} className="flex items-center gap-1.5"><span className="rounded-md border border-border px-2 py-1">{l} <b className="font-mono">{v ?? "—"}</b></span>{i < flow.length - 1 && <ArrowRight className="size-3 text-muted-foreground" />}</span>)}</div>
  </Card>;
}

export function TmsStatusCard() {
  const { run, connection } = useApp(); const t = run.tms as typeof run.tms & { read_at?: string | null };
  const readAt = t.read_at ?? (connection?.kind === "file" ? connection.read_at : null);
  return <Card className="p-5"><div className="flex items-start justify-between gap-3"><SectionHead title="TMS connection" caption={t.honesty} /><Badge tone={connection ? "green" : "blue"}>{connection ? "Connected" : "DEMO"}</Badge></div>
    <dl className="grid grid-cols-2 gap-3 text-xs">
      <div><dt className="text-muted-foreground">Connector</dt><dd className="mt-1 font-medium break-words">{t.connector}</dd></div>
      <div><dt className="text-muted-foreground">Status</dt><dd className="mt-1 font-medium">{t.status}</dd></div>
      <div><dt className="text-muted-foreground">Bookings read</dt><dd className="mt-1 font-mono">{t.bookings_read}</dd></div>
      <div><dt className="text-muted-foreground">Changes queued</dt><dd className="mt-1 font-mono">{t.queued}</dd></div>
      {readAt && <div className="col-span-2"><dt className="text-muted-foreground">Last read</dt><dd className="mt-1 font-mono">{new Date(readAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</dd></div>}
      {connection?.writeback_url && <div className="col-span-2"><dt className="text-muted-foreground">Write-back</dt><dd className="mt-1 font-mono">{hostOf(connection.writeback_url)}</dd></div>}
    </dl>
    <Link to="/tms" className="mt-5 inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground">{connection ? "Manage" : "Connect your TMS"}</Link>
  </Card>;
}

function McpCard() {
  const [copied, setCopied] = useState(false);
  return <Card className="p-5"><SectionHead title="Use SQRlane from Claude" caption="Add it as a custom connector in Claude to ask the desk from there." />
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted p-1 pl-3"><code className="min-w-0 flex-1 truncate font-mono text-xs">{MCP_URL}</code><Button variant="outline" className="h-8 shrink-0" onClick={() => { try { void navigator.clipboard.writeText(MCP_URL); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard unavailable */ } }}>{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? "Copied" : "Copy"}</Button></div>
    <div className="mt-3 flex flex-wrap gap-2 text-xs">{["ask_sqrlane", "list_bookings", "list_scenarios"].map(t => <span key={t} className="rounded-md border border-border px-2 py-1 font-mono">{t}</span>)}<span className="self-center text-muted-foreground">read-only tools</span></div>
  </Card>;
}
