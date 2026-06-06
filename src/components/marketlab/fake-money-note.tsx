import { cn } from "@/lib/utils";

type FakeMoneyNoteProps = {
  className?: string;
};

export function FakeMoneyNote({ className }: FakeMoneyNoteProps) {
  return (
    <p
      className={cn(
        "rounded-lg border border-brand/20 bg-brand/5 px-3 py-2 text-sm text-muted-foreground dark:border-brand/25 dark:bg-brand/8",
        className,
      )}
    >
      This workshop app does not use real money. Spend fake cents to collect Yes
      or No shares.
    </p>
  );
}
