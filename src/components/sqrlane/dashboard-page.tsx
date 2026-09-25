import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { recordedInsights } from "@/data/ask-fixtures";
import { getInsights, type InsightsData } from "@/lib/api";
import { Badge, Card } from "@/components/ui";
import { useApp } from "./app-context";
import { DeskToday, TmsStatusCard } from "./ask-page";
import { SectionHead } from "./operations-pages";

export function DashboardPage() {
  const { selectedScenario } = useApp();
  const [data, setData] = useState<InsightsData>(recordedInsights);
  const [recorded, setRecorded] = useState(false);
  useEffect(() => { let live = true; getInsights(selectedScenario).then(v => { if (live) { setData(v); setRecorded(false) } }).catch(() => { if (live) { setData(recordedInsights); setRecorded(true) } }); return () => { live = false } }, [selectedScenario]);
  return <div className="space-y-5">
    <div className="flex items-start justify-between gap-4"><div><h2 className="text-sm font-semibold">{data.title}</h2><p className="mt-1 text-xs text-muted-foreground">{data.subtitle}</p></div>{recorded && <Badge tone="amber">Recorded</Badge>}</div>
    <div className="stat-grid">{data.cards.map(card => <Card key={card.label} className="min-w-0 p-5"><p className="stat-label">{card.label}</p><p className="mt-3 break-words font-mono text-3xl font-semibold">{card.value}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{card.caption}</p></Card>)}</div>
    <div className="grid gap-5 xl:grid-cols-2"><Card className="min-w-0 p-5"><SectionHead title={data.workload.title} caption={data.workload.subtitle}/><div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-state-blue"/>Work handled</div><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.workload.bars} margin={{ top: 10, right: 8, left: -24, bottom: 24 }}><CartesianGrid vertical={false} stroke="var(--border)"/><XAxis dataKey="label" interval={0} angle={-25} textAnchor="end" height={58} tick={{fontSize:9,fill:"var(--muted-foreground)"}} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} tick={{fontSize:10,fill:"var(--muted-foreground)"}} axisLine={false} tickLine={false}/><Tooltip cursor={{fill:"var(--muted)"}} contentStyle={{border:"1px solid var(--border)",borderRadius:"8px",background:"var(--card)",fontSize:"12px"}}/><Bar dataKey="value" fill="var(--state-blue)" radius={[5,5,0,0]} maxBarSize={28}/></BarChart></ResponsiveContainer></div></Card><ShareChart section={data.mix} tone="blue"/></div>
    <div className="grid gap-5 xl:grid-cols-2"><ShareChart section={data.approvals} tone="amber"/><div className="grid gap-5"><DeskToday/><TmsStatusCard/></div></div>
    <p className="text-xs text-muted-foreground">{data.note}</p>
  </div>;
}

function ShareChart({ section, tone }: { section: { title: string; subtitle: string; rows: ReadonlyArray<{ label: string; count: number; share: number }> }; tone: "blue"|"amber" }) {
  return <Card className="min-w-0 p-5"><SectionHead title={section.title} caption={section.subtitle}/><div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground"><span className={`size-2 rounded-full bg-state-${tone}`}/>Share</div><div className="space-y-4">{section.rows.map(row => <div key={row.label} title={`${row.count} · ${row.share}%`}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span>{row.label}</span><span className="font-mono text-muted-foreground">{row.share}%</span></div><div className={`h-2.5 rounded-full bg-state-${tone}-soft`}><div className={`h-full rounded-full bg-state-${tone}`} style={{width:`${row.share}%`}}/></div></div>)}</div></Card>;
}