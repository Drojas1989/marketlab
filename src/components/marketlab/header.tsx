import Image from "next/image";
import Link from "next/link";

import { HeaderAuth } from "@/components/marketlab/header-auth";
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
        "border-b border-border bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo/logo-marketlab.webp"
              alt="MarketLab"
              width={677}
              height={369}
              className="h-10 w-auto object-contain dark:brightness-110"
              priority
            />
            <span className="sr-only">MarketLab</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-4">
            <Link
              href="/markets"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Markets
            </Link>
            <Link
              href="/positions"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              My Positions
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <HeaderAuth userId={user?.id ?? null} profile={profile} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
