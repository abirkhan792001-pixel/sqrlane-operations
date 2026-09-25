import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { recordedMap } from "@/data/map-fixture";
import { WORLD_COAST_PATH } from "@/data/world-coast";
import { getMap, type MapData, type ScenarioId } from "@/lib/api";
import { stateLabel, toneFor } from "@/lib/presentation";
import { Badge, Button, Card } from "@/components/ui";
import { useApp } from "./app-context";
import { SectionHead } from "./operations-pages";

type Lane = MapData["map"]["lanes"][number];

export function MapPage() {
  const { run, selectedScenario, connection } = useApp();
  const scenario = (run as unknown as { scenario?: { id?: ScenarioId } | null }).scenario?.id ?? selectedScenario;
  const [data, setData] = useState<MapData>(recordedMap);
  const [recorded, setRecorded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const load = useCallback(async () => {
    setRefreshing(true);
    try { setData(await getMap(scenario, connection)); setRecorded(false); }
    catch { setData(recordedMap); setRecorded(true); }
    finally { setRefreshing(false); setPulse(value => value + 1); }
  }, [scenario, connection]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { const delay = Math.max(data.refresh_seconds, 10) * 1000; const timer = window.setInterval(() => void load(), delay); return () => window.clearInterval(timer); }, [data.refresh_seconds, load]);
  const readAt = data.read_at ? new Date(data.read_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "not read yet";
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4">
      <div className="flex min-w-0 items-center gap-3"><span key={pulse} className="monitor-dot"/><p className="min-w-0 text-xs text-muted-foreground">Read through <b className="text-foreground">{data.connector}</b> · {data.bookings} bookings · last read {readAt}</p>{recorded && <Badge tone="amber">Recorded</Badge>}</div>
      <Button variant="outline" disabled={refreshing} onClick={() => void load()}><RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`}/>Refresh</Button>
    </div>
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="min-w-0 p-5"><SectionHead title="Booking map" caption={`${data.mapped} of ${data.bookings} bookings mapped from the TMS link`}/><MapCanvas data={data} highlighted={highlighted} onHighlight={setHighlighted}/></Card>
      <Card className="overflow-hidden"><div className="p-5"><SectionHead title="Shipments" caption="Hover to trace a lane"/></div><div className="divide-y divide-border">{data.shipments.map(shipment => <ShipmentRow key={shipment.id} shipment={shipment} onHighlight={setHighlighted}/>)}</div></Card>
    </div>
    <p className="text-xs text-muted-foreground">{data.note}</p>
  </div>;
}

function ShipmentRow({ shipment, onHighlight }: { shipment: MapData["shipments"][number]; onHighlight: (id: string | null) => void }) {
  const navigate = useNavigate();
  return <button className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted" onMouseEnter={() => onHighlight(shipment.id)} onMouseLeave={() => onHighlight(null)} onFocus={() => onHighlight(shipment.id)} onBlur={() => onHighlight(null)} onClick={() => void navigate({ to: "/shipments", search: { id: shipment.id } })}>
    <div className="min-w-0 flex-1"><p className="font-mono text-xs font-semibold">{shipment.id}</p><p className="mt-1 truncate text-xs text-muted-foreground">{shipment.cargo}</p></div><div className="text-right"><Badge tone={toneFor(shipment.state)}>{stateLabel(shipment.state)}</Badge><p className="mt-1 font-mono text-[10px] text-muted-foreground">{shipment.eta}</p></div>
  </button>;
}

export function MapCanvas({ data, compact = false, highlighted, onHighlight }: { data: MapData; compact?: boolean; highlighted?: string | null; onHighlight?: (id: string | null) => void }) {
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>(null);
  const lanes = data.map.lanes;
  const laneById = useMemo(() => new Map(lanes.map(lane => [lane.id, lane])), [lanes]);
  const selected = active ? laneById.get(active) : undefined;
  return <div className="map-wrap">
    <svg viewBox={`0 0 ${data.map.frame.width} ${data.map.frame.height}`} role="img" aria-label={`Map of ${data.bookings} monitored bookings`} className="map-svg">
      <path d={WORLD_COAST_PATH} className="map-land"/>
      {lanes.map(lane => <polyline key={lane.id} points={lane.points.map(point => point.join(",")).join(" ")} className={`map-lane map-${laneTone(lane.state)} ${(highlighted === lane.id || active === lane.id) ? "map-highlight" : ""}`}/>) }
      {!compact && data.map.places.filter(place => place.on_board).map(place => <g key={place.id}><circle cx={place.x} cy={place.y} r="3" className="map-place"/><text x={place.lx} y={place.ly} className="map-label">{place.name}</text>{place.blocked && <circle cx={place.x} cy={place.y} r="9" className="map-blocked"><title>{place.blocked.title}</title></circle>}</g>)}
      {lanes.map(lane => <g key={`marker-${lane.id}`} className="map-marker" role="link" tabIndex={0} aria-label={`Open ${lane.id}`} onMouseEnter={() => { setActive(lane.id); onHighlight?.(lane.id); }} onMouseLeave={() => { setActive(null); onHighlight?.(null); }} onFocus={() => { setActive(lane.id); onHighlight?.(lane.id); }} onBlur={() => { setActive(null); onHighlight?.(null); }} onClick={() => void navigate({ to: "/shipments", search: { id: lane.id } })} onKeyDown={event => { if (event.key === "Enter") void navigate({ to: "/shipments", search: { id: lane.id } }); }}><circle cx={lane.position.x} cy={lane.position.y} r={compact ? 6 : 7} className={`map-booking map-fill-${laneTone(lane.state)}`}/></g>)}
    </svg>
    {!compact && selected && <div className="map-popover"><div className="flex items-center justify-between gap-3"><b className="font-mono text-xs">{selected.id}</b><Badge tone={toneFor(selected.state)}>{stateLabel(selected.state)}</Badge></div><p className="mt-2 text-sm font-medium">{selected.cargo}</p><p className="mt-1 text-xs">{selected.from} → {selected.to}</p><p className="mt-2 text-xs">ETA {selected.eta} · {selected.position.status} · {Math.round(selected.position.progress * 100)}% of the voyage</p><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{selected.position.basis}</p></div>}
  </div>;
}

function laneTone(state: Lane["state"]) { return state === "hold" ? "amber" : state === "rerouted" ? "blue" : "green"; }

export function BoardMap() {
  const { run, selectedScenario, connection } = useApp();
  const navigate = useNavigate();
  const scenario = (run as unknown as { scenario?: { id?: ScenarioId } | null }).scenario?.id ?? selectedScenario;
  const [data, setData] = useState<MapData>(recordedMap);
  useEffect(() => { let live = true; getMap(scenario, connection).then(value => { if (live) setData(value); }).catch(() => { if (live) setData(recordedMap); }); return () => { live = false; }; }, [scenario, connection]);
  return <Card className="p-5"><div className="flex items-start justify-between gap-3"><SectionHead title="Bookings in motion" caption={`${data.mapped} of ${data.bookings} bookings mapped`}/><Button variant="outline" onClick={() => void navigate({ to: "/map" })}>Open map</Button></div><MapCanvas data={data} compact/></Card>;
}