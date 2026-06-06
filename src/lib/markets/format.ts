import type { MarketStatus } from "@/lib/markets/types";

const statusLabels: Record<MarketStatus, string> = {
  open: "Open",
  closed: "Closed",
  resolved: "Resolved",
};

export function formatStatusLabel(status: MarketStatus): string {
  return statusLabels[status] ?? status;
}

export function formatCloseDate(closeDate: string | null): string {
  if (!closeDate) {
    return "No close date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(closeDate));
}

export function formatYesChancePercent(yesChance: number): string {
  return `${Math.round(yesChance * 100)}%`;
}
