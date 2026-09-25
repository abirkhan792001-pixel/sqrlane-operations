import { createFileRoute } from "@tanstack/react-router";
import { ApprovalsPage } from "@/components/sqrlane/tms-pages";
export const Route = createFileRoute("/approvals")({
 head: () => ({ meta: [
  { title: "Approvals — SQRlane" }, { name: "description", content: "Drafts and queued demo connector changes waiting for local approval." },
  { property: "og:title", content: "Approvals — SQRlane" }, { property: "og:description", content: "Drafts and queued demo connector changes waiting for local approval." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: ApprovalsPage
});
