import { createFileRoute } from "@tanstack/react-router";
import { AskPage } from "@/components/sqrlane/ask-page";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined } => ({ q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined }),
  head: () => ({ meta: [
    { title: "Ask SQRlane — the freight desk" },
    { name: "description", content: "Ask the SQRlane desk about a booking, a port, a rate, an invoice, customs or what is waiting for you." },
    { property: "og:title", content: "Ask SQRlane — the freight desk" },
    { property: "og:description", content: "Ask the SQRlane desk about a booking, a port, a rate, an invoice, customs or what is waiting for you." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AskPage,
});
