import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";
import { totalSharesCents } from "@/lib/positions/types";

const samplePosition = {
  id: "pos-1",
  market_id: "market-1",
  yes_shares_cents: 500,
  no_shares_cents: 250,
  market: {
    id: "market-1",
    title: "Will it rain tomorrow?",
    status: "open" as const,
    close_date: "2026-12-31T23:59:59.000Z",
  },
};

function PositionsTableRow({ position }: { position: typeof samplePosition }) {
  return (
    <tr>
      <td>
        <a href={`/markets/${position.market.id}`}>{position.market.title}</a>
      </td>
      <td>{position.market.status}</td>
      <td>{position.yes_shares_cents}</td>
      <td>{position.no_shares_cents}</td>
      <td>{totalSharesCents(position)}</td>
    </tr>
  );
}

describe("positions UI", () => {
  it("renders an empty positions state", () => {
    const html = renderToStaticMarkup(<PositionsEmptyState />);

    expect(html).toContain("No positions yet");
    expect(html).toContain("Browse markets");
    expect(html).toContain("/markets");
  });

  it("computes total shares from yes and no share cents", () => {
    expect(totalSharesCents(samplePosition)).toBe(750);
  });

  it("renders yes shares, no shares, and total shares", () => {
    const html = renderToStaticMarkup(
      <table>
        <tbody>
          <PositionsTableRow position={samplePosition} />
        </tbody>
      </table>,
    );

    expect(html).toContain("Will it rain tomorrow?");
    expect(html).toContain("/markets/market-1");
    expect(html).toContain("500");
    expect(html).toContain("250");
    expect(html).toContain("750");
  });
});

describe("positions signed-out state", () => {
  it("uses a sign-in message without position rows", () => {
    const html = renderToStaticMarkup(
      <div>
        <h1>My Positions</h1>
        <p>Sign in to see your fake-money positions.</p>
        <a href="/sign-in">Sign in</a>
      </div>,
    );

    expect(html).toContain("Sign in to see your fake-money positions");
    expect(html).toContain('href="/sign-in"');
    expect(html).not.toContain("Will it rain tomorrow?");
  });
});
