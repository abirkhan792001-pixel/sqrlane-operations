import { createFileRoute } from "@tanstack/react-router";
import { ShipmentsPage } from "@/components/sqrlane/operations-pages";
export const Route = createFileRoute("/shipments")({
 validateSearch: (s: Record<string, unknown>): { id?: string } => ({ id: typeof s.id === "string" && s.id ? s.id : undefined }),
 head: () => ({ meta: [
  { title: "Shipments — SQRlane" }, { name: "description", content: "Every booking, freight decision and approval gate." },
  { property: "og:title", content: "Shipments — SQRlane" }, { property: "og:description", content: "Every booking, freight decision and approval gate." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: ShipmentsPage
});
