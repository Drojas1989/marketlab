import { formatFakeShares } from "@/lib/fake-money";
import { cn } from "@/lib/utils";

type PositionsSummaryProps = {
  marketsHeld: number;
  totalSharesCents: number;
  yesExposureCents: number;
  noExposureCents: number;
  className?: string;
};

type SummaryStatProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

function SummaryStat({ label, value, valueClassName }: SummaryStatProps) {
  return (
    <div className="stat-panel">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-xl font-semibold tabular-nums tracking-tight text-foreground sm:text-2xl",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function PositionsSummary({
  marketsHeld,
  totalSharesCents,
  yesExposureCents,
  noExposureCents,
  className,
}: PositionsSummaryProps) {
  return (
    <div
      className={cn("mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      <SummaryStat label="Markets held" value={String(marketsHeld)} />
      <SummaryStat
        label="Total shares"
        value={formatFakeShares(totalSharesCents)}
      />
      <SummaryStat
        label="Yes exposure"
        value={formatFakeShares(yesExposureCents)}
        valueClassName="text-yes dark:text-yes"
      />
      <SummaryStat
        label="No exposure"
        value={formatFakeShares(noExposureCents)}
        valueClassName="text-no dark:text-no"
      />
    </div>
  );
}
