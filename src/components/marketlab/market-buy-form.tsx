"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { buyMarketShares } from "@/app/actions/buy";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatFakeBalanceCents,
  formatFakeDollars,
  formatFakeShares,
  parseFakeDollarInput,
} from "@/lib/fake-money";
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
  const [amountInput, setAmountInput] = useState("");
  const [state, action, pending] = useActionState(
    buyMarketShares,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [router, state?.success]);

  const parsedAmount = parseFakeDollarInput(amountInput);

  if (!signedIn) {
    return (
      <Card className="border-t-2 border-t-brand/30">
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
      <Card className="border-t-2 border-t-brand/30">
        <CardHeader>
          <CardTitle>Buy fake shares</CardTitle>
          <CardDescription>
            This market is not open for new fake-money buys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Available fake balance: {formatFakeDollars(balanceCents ?? 0)}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="text-yes">
              Yes shares: {formatFakeShares(yesSharesCents)}
            </p>
            <p className="text-no">
              No shares: {formatFakeShares(noSharesCents)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-t-2 border-t-brand/30">
      <CardHeader>
        <CardTitle>Buy fake shares</CardTitle>
        <CardDescription>
          Spend fake cents to collect Yes or No shares. 1 fake cent spent = 1
          share cent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="market_id" value={marketId} />

          <fieldset className="space-y-2" disabled={pending}>
            <legend className="text-sm font-medium text-foreground">
              Choose a side
            </legend>
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
          </fieldset>

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
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              className="field-input"
            />
            {amountInput.trim() ? (
              <p
                className={cn(
                  "text-sm",
                  parsedAmount.ok
                    ? "text-muted-foreground"
                    : "text-destructive",
                )}
                aria-live="polite"
              >
                {parsedAmount.ok
                  ? `You'll receive ${formatFakeBalanceCents(parsedAmount.cents)}.`
                  : parsedAmount.error}
              </p>
            ) : null}
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <p>
              Available fake balance:{" "}
              <span className="font-medium text-foreground">
                {formatFakeDollars(balanceCents ?? 0)}
              </span>
            </p>
            <div className="mt-2 grid gap-1 sm:grid-cols-2">
              <p className="text-yes">
                Your Yes shares: {formatFakeShares(yesSharesCents)}
              </p>
              <p className="text-no">
                Your No shares: {formatFakeShares(noSharesCents)}
              </p>
            </div>
          </div>

          {state?.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          {state?.success ? (
            <p className="text-sm text-yes dark:text-yes" role="status">
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

const sideCheckedStyles: Record<"yes" | "no", string> = {
  yes: "has-checked:border-yes has-checked:bg-yes-muted/80 has-checked:text-yes dark:has-checked:bg-yes-muted/50",
  no: "has-checked:border-no has-checked:bg-no-muted/80 has-checked:text-no dark:has-checked:bg-no-muted/50",
};

function SideOption({ id, name, value, label, disabled }: SideOptionProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg border border-input px-3 py-2.5 text-sm font-semibold transition-colors",
        sideCheckedStyles[value],
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
