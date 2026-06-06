import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: () => [null, vi.fn(), true],
    useEffect: () => {},
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import { MarketBuyForm } from "@/components/marketlab/market-buy-form";

describe("MarketBuyForm pending state", () => {
  it("disables submit while pending", () => {
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

    expect(html).toContain("Buying fake shares...");
    expect(html).toContain("disabled");
  });
});
