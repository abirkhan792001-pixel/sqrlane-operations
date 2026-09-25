import { createFileRoute } from "@tanstack/react-router";
import { AskPage } from "@/components/sqrlane/ask-page";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined; chat?: string | undefined } => ({ q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined, chat: typeof s["chat"] === "string" && s["chat"] ? s["chat"] : undefined }),
  head: () => ({ meta: [
    { title: "Home — SQRlane" },
    { name: "description", content: "Ask the SQRlane desk about a booking, a port, a rate, an invoice, customs or what is waiting for you." },
    { property: "og:title", content: "Home — SQRlane" },
    { property: "og:description", content: "Ask the SQRlane desk about a booking, a port, a rate, an invoice, customs or what is waiting for you." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AskPage,
});
