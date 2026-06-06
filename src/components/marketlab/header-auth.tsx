import Link from "next/link";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  formatFakeBalance,
  formatFakeBalanceCents,
} from "@/lib/profile/format";
import type { Profile } from "@/lib/profile/queries";
import { cn } from "@/lib/utils";

type HeaderAuthProps = {
  userId: string | null;
  profile: Profile | null;
  className?: string;
};

export function HeaderAuth({ userId, profile, className }: HeaderAuthProps) {
  if (!userId) {
    return (
      <div
        data-slot="header-auth"
        className={cn("flex items-center gap-2", className)}
      >
        <Button asChild variant="ghost" size="sm">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      data-slot="header-auth"
      className={cn("flex items-center gap-3", className)}
    >
      {profile ? (
        <div
          className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm"
          title={formatFakeBalanceCents(profile.balance_cents)}
        >
          <span className="font-medium tabular-nums text-foreground">
            {formatFakeBalance(profile.balance_cents)}
          </span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">
          Balance unavailable
        </span>
      )}
      <form action={signOut}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
