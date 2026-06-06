import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import { MarketCard } from "@/components/marketlab/market-card";
import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { FLAT_SERIES_LABEL } from "@/lib/markets/probability";
import type { Market } from "@/lib/markets/types";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: () => [null, vi.fn(), false],
    useEffect: () => {},
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const sampleMarket: Market = {
  id: "market-1",
  title: "Will it rain tomorrow?",
  description: "A fictional weather market for the workshop.",
  status: "open",
  close_date: "2026-12-31T23:59:59.000Z",
  created_at: "2026-06-01T00:00:00.000Z",
  updated_at: "2026-06-01T00:00:00.000Z",
};

describe("market UI rendering", () => {
  it("renders a market list card with status and close date", () => {
    const html = renderToStaticMarkup(<MarketCard market={sampleMarket} />);

    expect(html).toContain("Will it rain tomorrow?");
    expect(html).toContain("A fictional weather market for the workshop.");
    expect(html).toContain("Open");
    expect(html).toContain("View market");
    expect(html).toContain("/markets/market-1");
  });

  it("renders an empty market state", () => {
    const html = renderToStaticMarkup(<MarketsEmptyState />);

    expect(html).toContain("No markets yet");
    expect(html).toContain("Browse fictional Yes/No markets using fake money.");
  });

  it("renders the probability chart", () => {
    const html = renderToStaticMarkup(
      <ProbabilityChart
        yesChance={0.5}
        points={[
          { at: "2026-06-01T00:00:00.000Z", yesChance: 0.5 },
          { at: "2026-06-06T00:00:00.000Z", yesChance: 0.5 },
        ]}
        seriesMode="flat"
        seriesLabel={FLAT_SERIES_LABEL}
        source="baseline"
      />,
    );

    expect(html).toContain("Yes probability");
    expect(html).toContain("50%");
    expect(html).toContain("<polyline");
  });

  it("shows not-buyable state for closed markets", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        buyable={false}
        signedIn
        balanceCents={10000}
        yesSharesCents={0}
        noSharesCents={0}
        signInHref="/sign-in"
      />,
    );

    expect(html).toContain("not open for new fake-money buys");
    expect(html).not.toContain('name="amount"');
  });

  it("renders the theme toggle", () => {
    const html = renderToStaticMarkup(<ThemeToggle />);

    expect(html).toContain("Switch to dark mode");
  });

  it("does not render hero or template images on market UI", () => {
    const html = renderToStaticMarkup(
      <>
        <MarketCard market={sampleMarket} />
        <MarketsEmptyState />
      </>,
    );

    expect(html).not.toContain("hero2-bg.webp");
    expect(html).not.toContain("quito.png");
  });
});
