import { Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { InsightsData } from "@/lib/api";
import { Badge, Card, Tooltip as Hint } from "@/components/ui";
import { toneFor } from "@/lib/presentation";
import { SectionHead } from "./operations-pages";

export function RunwayCard({ section, compact = false }: { section: InsightsData["runway"]; compact?: boolean }) {
  const maximum = Math.max(1, ...section.rows.flatMap((row) => [row.slack_days, row.worst_delay_days, row.delay_after_decision_days]));
  return <Card className="min-w-0 p-5"><SectionHead title="Which booking runs out of time first?" caption={section.subtitle}/><div className="space-y-1">{section.rows.map((row) => <Link key={row.id} to="/shipments" search={{ id: row.id }} className="grid min-h-16 grid-cols-[minmax(88px,150px)_minmax(130px,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted sm:gap-5">
    <div className="min-w-0"><p className="font-mono text-xs font-semibold">{row.id}</p><p className="truncate text-[11px] text-muted-foreground">{row.cargo}</p></div>
    <div className="relative h-8" aria-label={`${row.slack_days} days slack, ${row.worst_delay_days} days worst delay, ${row.delay_after_decision_days} days after the decision`}>
      <div className="absolute left-0 top-3 h-2 rounded-full bg-state-green-soft" style={{ width: `${row.slack_days / maximum * 100}%` }}/>
      <Hint title="If nothing is done" content={`${row.worst_delay_days}d`}><span className="absolute top-1 size-3 -translate-x-1/2 rounded-full bg-state-red" style={{ left: `${row.worst_delay_days / maximum * 100}%` }}/></Hint>
      <Hint title="After the decision" content={`${row.delay_after_decision_days}d`}><span className="absolute top-4 size-3 -translate-x-1/2 rounded-full border-2 border-state-blue bg-card" style={{ left: `${row.delay_after_decision_days / maximum * 100}%` }}/></Hint>
      <span className="absolute bottom-0 left-0 text-[9px] text-muted-foreground">0</span><span className="absolute bottom-0 right-0 text-[9px] text-muted-foreground">{maximum}d</span>
    </div>
    <div className="flex min-w-14 flex-col items-end gap-1"><b className={`font-mono text-sm ${row.margin_after_decision_days < 0 ? "text-state-red" : ""}`}>{signedDays(row.margin_after_decision_days)}</b><Hint title="Status" content={section.statuses[row.status as keyof typeof section.statuses]}><span><Badge tone={statusTone(row.status)}>{row.status}</Badge></span></Hint></div>
  </Link>)}</div></Card>;
}

export function WorkChart({ section }: { section: InsightsData["workload"] }) {
  return <Card className="min-w-0 p-5"><SectionHead title="How much did each agent do?" caption={section.subtitle}/><div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={section.bars} margin={{ top: 5, right: 4, left: -28, bottom: 32 }}><CartesianGrid vertical={false} stroke="var(--border)"/><XAxis dataKey="label" angle={-28} textAnchor="end" interval={0} height={62} tick={{ fontSize: 8, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="value" fill="var(--state-blue)" maxBarSize={8} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></Card>;
}

export function ShareChart({ section, question, to }: { section: InsightsData["mix"] | InsightsData["approvals"]; question: string; to: "/desk" | "/approvals" }) {
  const total = section.total;
  return <Card className="min-w-0 p-5"><SectionHead title={question} caption={section.subtitle}/><div className="space-y-1">{section.rows.map((row) => <Link to={to} key={row.label} title={`${row.count} of ${total}`} className="block rounded-lg px-1 py-1.5 hover:bg-muted"><div className="mb-1 flex justify-between gap-2 text-[11px]"><span className="truncate">{row.label}</span><span className="font-mono text-muted-foreground">{row.count} of {total}</span></div><div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-state-blue" style={{ width: `${total ? row.count / total * 100 : 0}%` }}/></div></Link>)}</div></Card>;
}

export function eur(value: number | null | undefined) { return value == null ? "—" : `EUR ${value.toLocaleString("en-US")}`; }
export function signedDays(value: number) { return `${value >= 0 ? "+" : "−"}${Math.abs(value)}d`; }
function statusTone(status: string): "red" | "blue" | "amber" | "green" | "neutral" { return status === "breaks" ? "red" : status === "resolved" ? "blue" : status === "close" ? "amber" : status === "clear" ? "green" : toneFor(status); }