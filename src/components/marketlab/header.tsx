import Image from "next/image";
import Link from "next/link";

import { HeaderAuth } from "@/components/marketlab/header-auth";
import { HeaderNav } from "@/components/marketlab/header-nav";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { getCurrentUserProfile } from "@/lib/profile/queries";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

export async function Header({ className }: HeaderProps) {
  const { user, profile } = await getCurrentUserProfile();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <Link
              href="/markets"
              className="flex shrink-0 items-center gap-2.5"
            >
              <Image
                src="/logo/iso-marketlab.webp"
                alt=""
                width={64}
                height={64}
                className="size-8 object-contain dark:brightness-110"
                priority
              />
              <span className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                MarketLab
              </span>
            </Link>
            <HeaderNav />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <HeaderAuth userId={user?.id ?? null} profile={profile} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
