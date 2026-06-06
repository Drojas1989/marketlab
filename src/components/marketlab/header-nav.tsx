"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/markets", label: "Markets", matchPrefix: "/markets" },
  { href: "/positions", label: "My Positions", matchPrefix: "/positions" },
] as const;

function isActive(pathname: string, matchPrefix: string): boolean {
  if (matchPrefix === "/markets") {
    return pathname === "/markets" || pathname.startsWith("/markets/");
  }

  return pathname === matchPrefix || pathname.startsWith(`${matchPrefix}/`);
}

type HeaderNavProps = {
  className?: string;
};

export function HeaderNav({ className }: HeaderNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={cn(className)}>
      <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
        {navLinks.map((link) => {
          const active = isActive(pathname, link.matchPrefix);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand/10 text-brand dark:text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="md:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="absolute inset-x-0 top-full border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.matchPrefix);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand/10 text-brand dark:text-brand"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
