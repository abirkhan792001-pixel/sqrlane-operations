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
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4"><div className="min-w-0"><h2 className="text-2xl font-semibold">{data.title}</h2><p className="mt-1 text-sm text-muted-foreground">{data.subtitle}</p></div>{recorded && <Badge tone="amber">Recorded</Badge>}</div>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{data.cards.map(card => <Card key={card.label} className="min-w-0 p-5"><p className="text-xs text-muted-foreground">{card.label}</p><p className="mt-3 break-words font-mono text-3xl font-semibold">{card.value}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{card.caption}</p></Card>)}</div>
    <div className="grid gap-5 xl:grid-cols-2"><Card className="min-w-0 p-5"><SectionHead title={data.workload.title} caption={data.workload.subtitle}/><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.workload.bars} margin={{ top: 10, right: 8, left: -24, bottom: 24 }}><CartesianGrid vertical={false} stroke="var(--border)"/><XAxis dataKey="label" interval={0} angle={-25} textAnchor="end" height={58} tick={{fontSize:9,fill:"var(--muted-foreground)"}} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} tick={{fontSize:10,fill:"var(--muted-foreground)"}} axisLine={false} tickLine={false}/><Tooltip cursor={{fill:"var(--muted)"}}/><Bar dataKey="value" fill="var(--foreground)" barSize={2}/></BarChart></ResponsiveContainer></div></Card><ShareChart section={data.mix}/></div>
    <div className="grid gap-5 xl:grid-cols-2"><ShareChart section={data.approvals}/><div className="grid gap-5"><DeskToday/><TmsStatusCard/></div></div>
    <p className="text-xs text-muted-foreground">{data.note}</p>
  </div>;
}

function ShareChart({ section }: { section: InsightsData["mix"] }) {
  return <Card className="min-w-0 p-5"><SectionHead title={section.title} caption={section.subtitle}/><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={section.rows} layout="vertical" margin={{ top: 4, right: 18, left: 12, bottom: 2 }}><CartesianGrid horizontal={false} stroke="var(--border)"/><XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{fontSize:9,fill:"var(--muted-foreground)"}} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="label" width={110} tick={{fontSize:10,fill:"var(--muted-foreground)"}} axisLine={false} tickLine={false}/><Tooltip formatter={(value) => [`${value}%`, "Share"]}/><Bar dataKey="share" fill="var(--foreground)" radius={[0,4,4,0]} barSize={22}/></BarChart></ResponsiveContainer></div></Card>;
}