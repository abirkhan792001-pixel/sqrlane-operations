import { createFileRoute } from "@tanstack/react-router";
import { DeskPage } from "@/components/sqrlane/system-pages";
export const Route = createFileRoute("/desk")({
 head: () => ({ meta: [
  { title: "Desk — SQRlane" }, { name: "description", content: "The everyday freight inbox worked by the SQRlane agent team." },
  { property: "og:title", content: "Desk — SQRlane" }, { property: "og:description", content: "The everyday freight inbox worked by the SQRlane agent team." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: DeskPage
});
