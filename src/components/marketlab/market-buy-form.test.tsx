import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

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

import { MarketBuyForm } from "@/components/marketlab/market-buy-form";

describe("MarketBuyForm", () => {
  it("asks signed-out users to sign in", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        buyable
        signedIn={false}
        balanceCents={null}
        yesSharesCents={0}
        noSharesCents={0}
        signInHref="/sign-in"
      />,
    );

    expect(html).toContain("Sign in to buy Yes or No shares");
    expect(html).toContain('href="/sign-in"');
    expect(html).not.toContain('name="amount"');
  });

  it("shows a not-buyable message for closed markets", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        buyable={false}
        signedIn
        balanceCents={10000}
        yesSharesCents={250}
        noSharesCents={0}
        signInHref="/sign-in"
      />,
    );

    expect(html).toContain("not open for new fake-money buys");
    expect(html).toContain("$100.00 fake");
    expect(html).toContain("$2.50 fake");
    expect(html).not.toContain('name="amount"');
  });

  it("renders buy controls for signed-in buyable markets", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        buyable
        signedIn
        balanceCents={10000}
        yesSharesCents={0}
        noSharesCents={0}
        signInHref="/sign-in"
      />,
    );

    expect(html).toContain('name="market_id"');
    expect(html).toContain('value="market-1"');
    expect(html).toContain('name="side"');
    expect(html).toContain('name="amount"');
    expect(html).toContain("Available fake balance");
    expect(html).toContain("Buy fake shares");
  });
});
