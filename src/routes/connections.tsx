import { createFileRoute } from "@tanstack/react-router";
import { ConnectionsPage } from "@/components/sqrlane/connections-page";
export const Route = createFileRoute("/connections")({ head: () => ({ meta: [
  { title: "Connections — SQRlane" }, { name: "description", content: "Honest connection status for the SQRlane desk." },
  { property: "og:title", content: "Connections — SQRlane" }, { property: "og:description", content: "Honest connection status for the SQRlane desk." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: ConnectionsPage });