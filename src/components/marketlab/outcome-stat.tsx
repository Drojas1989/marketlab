import { cn } from "@/lib/utils";

type OutcomeSide = "yes" | "no";

type OutcomeStatProps = {
  side: OutcomeSide;
  label: string;
  value: string;
  className?: string;
};

const sideStyles: Record<OutcomeSide, string> = {
  yes: "border-yes/25 bg-yes-muted/60 dark:border-yes/30 dark:bg-yes-muted/40",
  no: "border-no/25 bg-no-muted/60 dark:border-no/30 dark:bg-no-muted/40",
};

const labelStyles: Record<OutcomeSide, string> = {
  yes: "text-yes dark:text-yes",
  no: "text-no dark:text-no",
};

export function OutcomeStat({
  side,
  label,
  value,
  className,
}: OutcomeStatProps) {
  return (
    <div className={cn("stat-panel", sideStyles[side], className)}>
      <p className={cn("text-sm font-medium", labelStyles[side])}>{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
