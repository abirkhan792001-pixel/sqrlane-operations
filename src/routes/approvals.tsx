import { createFileRoute } from "@tanstack/react-router";
import { ApprovalsPage } from "@/components/sqrlane/tms-pages";
export const Route = createFileRoute("/approvals")({
 validateSearch: (s: Record<string, unknown>) => ({ booking: typeof s["booking"] === "string" ? s["booking"] : undefined, kind: typeof s["kind"] === "string" ? s["kind"] : undefined, agent: typeof s["agent"] === "string" ? s["agent"] : undefined, severity: typeof s["severity"] === "string" ? s["severity"] : undefined, age: typeof s["age"] === "string" ? s["age"] : undefined, sort: typeof s["sort"] === "string" ? s["sort"] : undefined }),
 head: () => ({ meta: [
  { title: "Approvals — SQRlane" }, { name: "description", content: "Drafts and queued demo connector changes waiting for local approval." },
  { property: "og:title", content: "Approvals — SQRlane" }, { property: "og:description", content: "Drafts and queued demo connector changes waiting for local approval." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: ApprovalsPage
});
