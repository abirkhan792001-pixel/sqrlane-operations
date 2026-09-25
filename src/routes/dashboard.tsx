import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/sqrlane/dashboard-page";
export const Route = createFileRoute("/dashboard")({ head: () => ({ meta: [
  { title: "Today — SQRlane" }, { name: "description", content: "The operational command centre for decisions, watch items, and active disruptions." },
  { property: "og:title", content: "Today — SQRlane" }, { property: "og:description", content: "The operational command centre for decisions, watch items, and active disruptions." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: DashboardPage });