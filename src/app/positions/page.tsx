import Link from "next/link";

import { FakeMoneyChips } from "@/components/marketlab/fake-money-chips";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { PageIntro } from "@/components/marketlab/page-intro";
import { PageShell } from "@/components/marketlab/page-shell";
import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";
import { PositionsSummary } from "@/components/marketlab/positions-summary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFakeShares } from "@/lib/fake-money";
import { formatCloseDate } from "@/lib/markets/format";
import { getUserPositions } from "@/lib/positions/queries";
import { totalSharesCents } from "@/lib/positions/types";
import { getCurrentUserProfile } from "@/lib/profile/queries";

export default async function PositionsPage() {
  const { user } = await getCurrentUserProfile();

  if (!user) {
    return (
      <PageShell>
        <PageIntro
          title="My Positions"
          description="View the fake shares you hold across workshop markets."
        >
          <FakeMoneyChips />
        </PageIntro>

        <Card className="max-w-xl border-t-2 border-t-brand/40">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>
              Sign in to see your fake-money positions. Position data stays
              private to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const positions = await getUserPositions();
  const totalShares = positions.reduce(
    (sum, position) => sum + totalSharesCents(position),
    0,
  );
  const yesExposure = positions.reduce(
    (sum, position) => sum + position.yes_shares_cents,
    0,
  );
  const noExposure = positions.reduce(
    (sum, position) => sum + position.no_shares_cents,
    0,
  );

  return (
    <PageShell>
      <PageIntro
        title="My Positions"
        description="Markets where you hold fake Yes or No shares."
      >
        <FakeMoneyChips />
      </PageIntro>

      {positions.length === 0 ? (
        <PositionsEmptyState />
      ) : (
        <>
          <PositionsSummary
            marketsHeld={positions.length}
            totalSharesCents={totalShares}
            yesExposureCents={yesExposure}
            noExposureCents={noExposure}
          />

          <div className="overflow-x-auto rounded-xl border border-border ring-1 ring-foreground/5">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Market</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Closes</th>
                  <th className="px-4 py-3 text-left font-medium text-yes">
                    Yes
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-no">
                    No
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {positions.map((position) => (
                  <tr
                    key={position.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/markets/${position.market.id}`}
                        className="text-foreground underline-offset-4 hover:text-brand hover:underline"
                      >
                        {position.market.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <MarketStatusBadge status={position.market.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatCloseDate(position.market.close_date)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-yes">
                      {formatFakeShares(position.yes_shares_cents)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-no">
                      {formatFakeShares(position.no_shares_cents)}
                    </td>
                    <td className="px-4 py-3 tabular-nums font-medium">
                      {formatFakeShares(totalSharesCents(position))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageShell>
  );
}
