import { createFileRoute } from "@tanstack/react-router";
import { ApprovalsPage } from "@/components/sqrlane/tms-pages";
export const Route = createFileRoute("/approvals")({
 validateSearch: (s: Record<string, unknown>): { booking?: string; kind?: string; agent?: string; severity?: string; age?: string; sort?: string } => { const out: { booking?: string; kind?: string; agent?: string; severity?: string; age?: string; sort?: string } = {}; for (const key of ["booking","kind","agent","severity","age","sort"] as const) if (typeof s[key] === "string") out[key] = s[key]; return out; },
 head: () => ({ meta: [
  { title: "Approvals — SQRlane" }, { name: "description", content: "Drafts and queued demo connector changes waiting for local approval." },
  { property: "og:title", content: "Approvals — SQRlane" }, { property: "og:description", content: "Drafts and queued demo connector changes waiting for local approval." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: ApprovalsPage
});
