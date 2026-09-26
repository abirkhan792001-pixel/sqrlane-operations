import { createFileRoute } from "@tanstack/react-router";
import { AgentsPage } from "@/components/sqrlane/system-pages";
export const Route = createFileRoute("/agents")({
 head: () => ({ meta: [
  { title: "Agents — SQRlane" }, { name: "description", content: "Agent workload, inbox demand, approval sources, and where people were needed." },
  { property: "og:title", content: "Agents — SQRlane" }, { property: "og:description", content: "Agent workload, inbox demand, approval sources, and where people were needed." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: AgentsPage
});
