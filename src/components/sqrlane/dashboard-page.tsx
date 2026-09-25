import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Clock3, ExternalLink } from "lucide-react";
import { recordedInsights } from "@/data/ask-fixtures";
import { recordedMap } from "@/data/map-fixture";
import { ageLabel, approvalRows, severityRank } from "@/lib/approval-data";
import { getVerification } from "@/lib/connection-verification";
import { getInsights, getMap, type InsightsData, type MapData, type ScenarioId } from "@/lib/api";
import { sourceName, stateLabel, toneFor } from "@/lib/presentation";
import { Badge, Button, Card } from "@/components/ui";
import { useApp } from "./app-context";
import { MapCanvas } from "./map-page";
import { SectionHead, StatCard } from "./operations-pages";

export function DashboardPage() {
  const { run, workflow, approved, selectedScenario, connection } = useApp();
  const scenario = (run as unknown as { scenario?: { id?: ScenarioId; name?: string } | null }).scenario?.id ?? selectedScenario;
  const [data, setData] = useState<InsightsData>(recordedInsights as InsightsData);
  const [map, setMap] = useState<MapData>(recordedMap);
  const [recorded, setRecorded] = useState(false);
  const load = useCallback(async () => { try { setData(await getInsights(scenario, connection)); setRecorded(false); } catch { setData(recordedInsights as InsightsData); setRecorded(true); } }, [scenario, connection]);
  const loadMap = useCallback(async () => { try { setMap(await getMap(scenario, connection)); } catch { setMap(recordedMap); } }, [scenario, connection]);
  useEffect(() => { void load(); void loadMap(); }, [load, loadMap]);
  useEffect(() => { const timer = window.setInterval(() => void loadMap(), 60000); return () => window.clearInterval(timer); }, [loadMap]);
  const rows = useMemo(() => approvalRows(run, workflow), [run, workflow]);
  const waiting = rows.filter(row => !approved.has(row.key));
  const grouped = Object.values(waiting.reduce<Record<string, typeof waiting>>((all, row) => { (all[row.booking] ??= []).push(row); return all; }, {})).sort((a, b) => severityRank(b.reduce((m,r)=>severityRank(r.severity)>severityRank(m)?r.severity:m,"none")) - severityRank(a.reduce((m,r)=>severityRank(r.severity)>severityRank(m)?r.severity:m,"none")) || Math.max(...b.map(r=>r.queued_at?Date.parse(r.queued_at):0)) - Math.max(...a.map(r=>r.queued_at?Date.parse(r.queued_at):0))).slice(0,6);
  const watch = data.watchlist ?? { title: "On watch", subtitle: "", rule: "", rows: [] };
  const offPlan = run.summary.reroute + run.summary.hold;
  const tmsVerified = connection?.kind === "api" ? getVerification("api", connection.url) : undefined;
  const scenarioName = (run as unknown as { scenario?: { name?: string } | null }).scenario?.name ?? run.scenarios.find(s=>s.id===selectedScenario)?.name ?? "Calm board";
  return <div className="space-y-5">
    {recorded && <div className="flex justify-end"><Badge tone="amber">Recorded</Badge></div>}
    <Card className="grid gap-0 overflow-hidden sm:grid-cols-2 xl:grid-cols-4">
      <StateLink to="/overview" label="Scenario" value={scenarioName}/><StateLink to="/connections" label="TMS" value={!connection?"Demo":tmsVerified?`${run.tms.connector} · ${run.tms.status}`:`${run.tms.connector} · Configured — not verified`} dot={!connection||!!tmsVerified}/><StateLink to="/overview" label="Last run" value={run.ran_at?new Date(run.ran_at).toLocaleString([], {dateStyle:"medium",timeStyle:"short"}):"Not run yet"}/><StateLink to="/agents" label="Decision engine" value={run.ai?.model??"rules"}/>
    </Card>
    <div className="stat-grid"><Link to="/approvals"><StatCard label="Needs your approval" value={waiting.length} caption="Drafts, write-backs and desk outputs" tone="amber"/></Link><a href="#watchlist"><StatCard label="On watch" value={watch.rows.length} caption="Bookings close to their limit" tone="amber"/></a><Link to="/shipments"><StatCard label="Off plan" value={offPlan} caption={`${run.summary.reroute} rerouted · ${run.summary.hold} held`} tone="red"/></Link><Link to="/desk"><StatCard label="Desk today" value={workflow.stats.items} caption={`${workflow.stats.escalations} escalated`} tone="blue"/></Link></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <Card className="overflow-hidden"><div className="p-5"><SectionHead title="Needs your decision" caption="Highest severity first, then oldest queued"/></div>{grouped.length?grouped.map(group=><DecisionGroup key={group[0].booking} rows={group}/>):<p className="empty">Nothing waiting for you.</p>}</Card>
      <Card id="watchlist" className="p-5"><SectionHead title="On watch" caption={watch.subtitle}/>{watch.rows.length?<div className="space-y-5">{watch.rows.map(row=><WatchRow key={row.id} row={row}/>)}</div>:<div className="py-8 text-center"><p className="text-sm font-medium">Nothing close to its limit.</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{watch.rule}</p></div>}</Card>
    </div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <Card className="min-w-0 p-5"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3"><SectionHead title="Live map" caption={`Monitoring ${map.mapped} of ${map.bookings} mapped bookings every 60 seconds`}/><Link to="/map" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium">Open map <ExternalLink className="size-3"/></Link></div><MapCanvas data={map} compact/></Card>
      <Card className="p-5"><SectionHead title="Active disruptions"/>{run.risk.events.length?run.risk.events.map(event=>{const moved=run.shipments.filter(s=>(s.decision.triggering_events??[]).includes(event.event_id)&&s.state!=="green"&&s.state!=="no-action").length;return <div key={event.event_id} className="border-t border-border py-4 first:border-0 first:pt-0"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium leading-5">{event.title}</p><Badge tone={toneFor(event.severity)}>{event.severity}</Badge></div><p className="mt-2 text-xs text-muted-foreground">{sourceName(event.source)} · {moved} bookings moved</p></div>}):<p className="empty">Run a scenario to see disruptions here.</p>}</Card>
    </div>
    <div className="grid gap-5 xl:grid-cols-3"><WorkChart section={data.workload}/><ShareChart section={data.mix}/><ShareChart section={data.approvals}/></div>
    <p className="text-xs text-muted-foreground">{data.note}</p>
  </div>;
}
function StateLink({to,label,value,dot}:{to:"/overview"|"/connections"|"/agents";label:string;value:string;dot?:boolean}){return <Link to={to} className="min-w-0 border-b border-border px-4 py-3 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><p className="stat-label">{label}</p><p className="mt-1 flex min-w-0 items-center gap-2 truncate text-xs font-medium">{dot&&<span className="size-1.5 shrink-0 rounded-full bg-state-green"/>}<span className="truncate">{value}</span></p></Link>}
function DecisionGroup({rows}:{rows:ReturnType<typeof approvalRows>}){const drafts=rows.filter(r=>r.kind==="Email draft").length;const changes=rows.filter(r=>r.kind!=="Email draft").length;const severity=rows.reduce((m,r)=>severityRank(r.severity)>severityRank(m)?r.severity:m,"none");const oldest=rows.reduce<string|null>((m,r)=>!r.queued_at?m:!m||Date.parse(r.queued_at)<Date.parse(m)?r.queued_at:m,null);return <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-border px-5 py-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-semibold">{rows[0].booking}</span>{severity!=="none"&&<Badge tone={toneFor(severity)}>{severity}</Badge>}</div><p className="mt-1 truncate text-xs text-muted-foreground">{changes} changes · {drafts} drafts · {ageLabel(oldest)}</p></div><Link to="/approvals" search={{booking:rows[0].booking}} className="inline-flex h-8 shrink-0 items-center rounded-lg border border-border bg-card px-3 text-xs font-medium">Review</Link></div>}
function WatchRow({row}:{row:InsightsData["watchlist"]["rows"][number]}){const total=Math.max(row.slack_days,row.worst_delay_days,1);return <Link to="/shipments" search={{id:row.id}} className="block"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-mono text-xs font-semibold">{row.id}</p><p className="truncate text-xs text-muted-foreground">{row.cargo}</p></div><b className="shrink-0 font-mono text-sm">{row.margin_days}d</b></div><div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-muted"><span className="bg-state-green" style={{width:`${Math.min(100,row.slack_days/total*100)}%`}}/><span className="bg-state-red" style={{width:`${Math.min(100,row.worst_delay_days/total*100)}%`}}/></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{row.reason}</p></Link>}
function WorkChart({section}:{section:InsightsData["workload"]}){return <Card className="min-w-0 p-5"><SectionHead title={section.title} caption={section.subtitle}/><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={section.bars} margin={{top:5,right:4,left:-28,bottom:28}}><CartesianGrid vertical={false} stroke="var(--border)"/><XAxis dataKey="label" angle={-28} textAnchor="end" interval={0} height={55} tick={{fontSize:8,fill:"var(--muted-foreground)"}} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} tick={{fontSize:9,fill:"var(--muted-foreground)"}} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="value" fill="var(--foreground)" maxBarSize={8}/></BarChart></ResponsiveContainer></div></Card>}
function ShareChart({section}:{section:InsightsData["mix"]}){return <Card className="min-w-0 p-5"><SectionHead title={section.title} caption={section.subtitle}/><div className="space-y-2.5">{section.rows.slice(0,6).map(row=><div key={row.label} title={`${row.count} · ${row.share}%`}><div className="mb-1 flex justify-between gap-2 text-[11px]"><span className="truncate">{row.label}</span><span className="font-mono text-muted-foreground">{row.share}%</span></div><div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{width:`${row.share}%`}}/></div></div>)}</div></Card>}
