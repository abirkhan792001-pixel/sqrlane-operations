import { createFileRoute } from "@tanstack/react-router";
import { MapPage } from "@/components/sqrlane/map-page";

export const Route = createFileRoute("/map")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () => ({ meta: [
    { title: "Map — SQRlane" },
    { name: "description", content: "Every booking monitored through the SQRlane TMS link." },
    { property: "og:title", content: "Map — SQRlane" },
    { property: "og:description", content: "Every booking monitored through the SQRlane TMS link." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MapPage,
});