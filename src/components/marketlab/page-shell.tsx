import { Header } from "@/components/marketlab/header";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  mainClassName?: string;
};

export function PageShell({
  children,
  className,
  mainClassName,
}: PageShellProps) {
  return (
    <div className={cn("min-h-svh bg-background text-foreground", className)}>
      <Header />
      <main
        className={cn(
          "mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10",
          mainClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}
