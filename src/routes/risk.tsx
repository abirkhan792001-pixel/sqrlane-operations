import { createFileRoute } from "@tanstack/react-router";
import { RiskPage } from "@/components/sqrlane/operations-pages";
export const Route = createFileRoute("/risk")({
 head: () => ({ meta: [
  { title: "Risk feed — SQRlane" }, { name: "description", content: "Disruption signals and source status behind freight decisions." },
  { property: "og:title", content: "Risk feed — SQRlane" }, { property: "og:description", content: "Disruption signals and source status behind freight decisions." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: RiskPage
});
