import Link from "next/link";

import { Header } from "@/components/marketlab/header";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";
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
      <div className="min-h-svh bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              My Positions
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              View the fake shares you hold across workshop markets.
            </p>
          </div>

          <Card className="max-w-xl">
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
        </main>
      </div>
    );
  }

  const positions = await getUserPositions();

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            My Positions
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Markets where you hold fake Yes or No shares.
          </p>
        </div>

        {positions.length === 0 ? (
          <PositionsEmptyState />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Market</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Closes</th>
                  <th className="px-4 py-3 text-left font-medium">Yes</th>
                  <th className="px-4 py-3 text-left font-medium">No</th>
                  <th className="px-4 py-3 text-left font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {positions.map((position) => (
                  <tr key={position.id}>
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/markets/${position.market.id}`}
                        className="text-foreground underline-offset-4 hover:underline"
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
                    <td className="px-4 py-3 tabular-nums">
                      {formatFakeShares(position.yes_shares_cents)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
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
        )}
      </main>
    </div>
  );
}
