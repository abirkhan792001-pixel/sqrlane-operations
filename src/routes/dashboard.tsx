import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/sqrlane/dashboard-page";
export const Route = createFileRoute("/dashboard")({ head: () => ({ meta: [
  { title: "Dashboard — SQRlane" }, { name: "description", content: "Payload-backed operational insights from the SQRlane freight desk." },
  { property: "og:title", content: "Dashboard — SQRlane" }, { property: "og:description", content: "Payload-backed operational insights from the SQRlane freight desk." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: DashboardPage });