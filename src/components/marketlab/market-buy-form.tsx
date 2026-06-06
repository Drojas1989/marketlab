"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { buyMarketShares } from "@/app/actions/buy";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFakeDollars, formatFakeShares } from "@/lib/fake-money";
import type { BuyActionState } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

type MarketBuyFormProps = {
  marketId: string;
  buyable: boolean;
  signedIn: boolean;
  balanceCents: number | null;
  yesSharesCents: number;
  noSharesCents: number;
  signInHref: string;
};

const initialState: BuyActionState | null = null;

export function MarketBuyForm({
  marketId,
  buyable,
  signedIn,
  balanceCents,
  yesSharesCents,
  noSharesCents,
  signInHref,
}: MarketBuyFormProps) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    buyMarketShares,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [router, state?.success]);

  if (!signedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Buy fake shares</CardTitle>
          <CardDescription>
            Sign in to buy Yes or No shares with your workshop fake balance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={signInHref}>Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!buyable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Buy fake shares</CardTitle>
          <CardDescription>
            This market is not open for new fake-money buys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Available fake balance: {formatFakeDollars(balanceCents ?? 0)}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <p>Yes shares: {formatFakeShares(yesSharesCents)}</p>
            <p>No shares: {formatFakeShares(noSharesCents)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy fake shares</CardTitle>
        <CardDescription>
          Spend fake dollars to add Yes or No shares. One fake cent buys one
          share cent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="market_id" value={marketId} />

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Choose a side</p>
            <div className="grid grid-cols-2 gap-2">
              <SideOption
                id="buy-yes"
                name="side"
                value="yes"
                label="Yes"
                disabled={pending}
              />
              <SideOption
                id="buy-no"
                name="side"
                value="no"
                label="No"
                disabled={pending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="buy-amount"
              className="text-sm font-medium text-foreground"
            >
              Fake dollar amount
            </label>
            <input
              id="buy-amount"
              name="amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="10.00"
              required
              disabled={pending}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <p>
              Available fake balance:{" "}
              <span className="font-medium text-foreground">
                {formatFakeDollars(balanceCents ?? 0)}
              </span>
            </p>
            <div className="mt-2 grid gap-1 sm:grid-cols-2">
              <p>Your Yes shares: {formatFakeShares(yesSharesCents)}</p>
              <p>Your No shares: {formatFakeShares(noSharesCents)}</p>
            </div>
          </div>

          {state?.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          {state?.success ? (
            <p
              className="text-sm text-emerald-700 dark:text-emerald-300"
              role="status"
            >
              {state.success}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Buying fake shares..." : "Buy fake shares"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type SideOptionProps = {
  id: string;
  name: string;
  value: "yes" | "no";
  label: string;
  disabled?: boolean;
};

function SideOption({ id, name, value, label, disabled }: SideOptionProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors has-checked:border-primary has-checked:bg-primary/10",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        required
        disabled={disabled}
        className="sr-only"
      />
      {label}
    </label>
  );
}
