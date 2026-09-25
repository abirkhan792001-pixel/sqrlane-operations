import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "@/components/sqrlane/operations-pages";

export const Route = createFileRoute("/overview")({
  head: () => ({ meta: [
    { title: "Board — SQRlane" },
    { name: "description", content: "Freight decisions, disruptions and approvals across the active SQRlane board." },
    { property: "og:title", content: "Board — SQRlane" },
    { property: "og:description", content: "Freight decisions, disruptions and approvals across the active SQRlane board." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: OverviewPage,
});
