import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Plug } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { hostOf } from "@/lib/api";
import { useApp } from "./app-context";

const MCP_URL = "https://www.sqrlane.com/mcp";
export function ConnectionsPage() {
  const { run, connection } = useApp(); const [copied, setCopied] = useState(false);
  const risk = run.risk as typeof run.risk & { families?: string[] };
  const engine = run.ai;
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    <ConnectionCard title="Your TMS" status={connection ? "Connected" : "Demo"} tone={connection ? "green" : "blue"}><p>{run.tms.connector}</p><p className="text-muted-foreground">{run.tms.status}</p><PageLink to="/tms">{connection ? "Manage" : "Connect"}</PageLink></ConnectionCard>
    <ConnectionCard title="Write-back" status={connection?.writeback_url ? "Connected" : "Not connected"} tone={connection?.writeback_url ? "green" : "neutral"}><p>{connection?.writeback_url ? hostOf(connection.writeback_url) : "Not set — approved changes are exported"}</p><PageLink to="/tms">Open TMS link</PageLink></ConnectionCard>
    <ConnectionCard title="Mailbox (Outlook / Gmail)" status="Not connected" tone="neutral"><p>No mailbox is connected in this build. Drop a mail (.eml) into Home and the desk works it like any inbound mail.</p><PageLink to="/">Try it on Home</PageLink></ConnectionCard>
    <ConnectionCard title="Claude (MCP)" status="Connected" tone="green"><p>Add it as a custom connector in Claude to ask the desk from there.</p><div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted p-1 pl-3"><code className="min-w-0 flex-1 truncate font-mono text-xs">{MCP_URL}</code><Button variant="outline" className="h-8 shrink-0" onClick={() => { try { void navigator.clipboard.writeText(MCP_URL); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {} }}>{copied ? <Check className="size-3.5"/> : <Copy className="size-3.5"/>}{copied ? "Copied" : "Copy"}</Button></div><div className="flex flex-wrap gap-1.5">{["ask_sqrlane","list_bookings","list_scenarios"].map(x => <span key={x} className="rounded-md border border-border px-2 py-1 font-mono text-xs">{x}</span>)}</div></ConnectionCard>
    <ConnectionCard title="Risk sources" status={risk.live_sources_read > 0 ? "Connected" : "Not connected"} tone={risk.live_sources_read > 0 ? "green" : "neutral"}><p><span className="font-mono">{risk.live_sources_read}</span> of <span className="font-mono">{risk.live_sources_total}</span> sources read on the last run</p>{risk.live_sources_read === 0 && <p className="text-muted-foreground">Not read yet — press Run</p>}{risk.families && risk.families.length > 0 && <div className="flex flex-wrap gap-1.5">{risk.families.map(x => <Badge key={x}>{x}</Badge>)}</div>}</ConnectionCard>
    <ConnectionCard title="AI model" status={engine?.model ? "Connected" : "Demo"} tone={engine?.model ? "green" : "blue"}><p className="font-mono">{engine?.model ?? "Rules only"}</p>{engine?.provider && <p className="text-muted-foreground">{engine.provider}</p>}</ConnectionCard>
  </div>;
}
function ConnectionCard({ title, status, tone, children }: { title: string; status: string; tone: "green"|"blue"|"neutral"; children: React.ReactNode }) { return <Card className="flex min-h-56 flex-col p-5"><div className="flex items-start justify-between gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-muted"><Plug className="size-4"/></span><Badge tone={tone}>{status}</Badge></div><h2 className="mt-5 text-sm font-semibold">{title}</h2><div className="mt-2 flex flex-1 flex-col gap-3 text-xs leading-5">{children}</div></Card> }
function PageLink({to,children}:{to:"/"|"/tms";children:React.ReactNode}) { return <Link to={to} className="mt-auto inline-flex w-fit items-center text-sm font-medium hover:underline">{children} →</Link> }