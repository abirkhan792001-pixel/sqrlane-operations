import { createFileRoute } from "@tanstack/react-router";
import { TmsPage } from "@/components/sqrlane/tms-pages";
export const Route = createFileRoute("/tms")({
 head: () => ({ meta: [
  { title: "TMS link — SQRlane" }, { name: "description", content: "A transparent view of the SQRlane demo connector queue." },
  { property: "og:title", content: "TMS link — SQRlane" }, { property: "og:description", content: "A transparent view of the SQRlane demo connector queue." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: TmsPage
});
