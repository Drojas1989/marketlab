import { cn } from "@/lib/utils";

const chips = [
  "Workshop fake money",
  "1 fake cent = 1 share cent",
  "No real payments",
] as const;

type FakeMoneyChipsProps = {
  className?: string;
};

export function FakeMoneyChips({ className }: FakeMoneyChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <span
          key={chip}
          className="fake-chip border-brand/25 bg-brand/8 text-brand-foreground dark:border-brand/30 dark:bg-brand/12 dark:text-brand"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
