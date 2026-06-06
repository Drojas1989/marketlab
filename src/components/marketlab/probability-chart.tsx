"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatYesChancePercent } from "@/lib/markets/format";
import { filterChartPointsByRange } from "@/lib/markets/probability";
import type { ChartPoint, ChartSeriesMode } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

type ChartRange = "1d" | "1w" | "1m" | "all";

const rangeOptions: Array<{ value: ChartRange; label: string }> = [
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
  { value: "1m", label: "1M" },
  { value: "all", label: "All" },
];

type ProbabilityChartProps = {
  yesChance: number;
  points: ChartPoint[];
  seriesMode: ChartSeriesMode;
  seriesLabel: string;
  source: "positions" | "baseline";
};

const chartWidth = 640;
const chartHeight = 220;
const padding = { top: 16, right: 16, bottom: 28, left: 40 };

function buildPolyline(points: ChartPoint[]): string {
  if (points.length === 0) {
    return "";
  }

  const start = new Date(points[0].at).getTime();
  const end = new Date(points[points.length - 1].at).getTime();
  const timeSpan = Math.max(end - start, 1);
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  return points
    .map((point) => {
      const x =
        padding.left +
        ((new Date(point.at).getTime() - start) / timeSpan) * innerWidth;
      const y = padding.top + (1 - point.yesChance) * innerHeight;
      return `${x},${y}`;
    })
    .join(" ");
}

function formatAxisDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function ProbabilityChart({
  yesChance,
  points,
  seriesMode,
  seriesLabel,
  source,
}: ProbabilityChartProps) {
  const [range, setRange] = useState<ChartRange>("all");

  const visiblePoints = useMemo(
    () => filterChartPointsByRange(points, range),
    [points, range],
  );

  const polyline = buildPolyline(visiblePoints);
  const startLabel = visiblePoints[0]?.at ?? points[0]?.at;
  const endLabel =
    visiblePoints[visiblePoints.length - 1]?.at ??
    points[points.length - 1]?.at;

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Yes probability</CardTitle>
            <CardDescription>{seriesLabel}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tracking-tight">
              {formatYesChancePercent(yesChance)}
            </p>
            <p className="text-xs text-muted-foreground">
              {source === "baseline"
                ? "Neutral baseline — no market activity available"
                : "From aggregate positions"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {rangeOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="xs"
              variant={range === option.value ? "default" : "outline"}
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-auto w-full min-w-[320px] text-muted-foreground"
            role="img"
            aria-label={`Yes probability chart showing ${formatYesChancePercent(yesChance)}`}
          >
            <title>Yes probability chart</title>
            {[0, 25, 50, 75, 100].map((tick) => {
              const y =
                padding.top +
                (1 - tick / 100) * (chartHeight - padding.top - padding.bottom);
              return (
                <g key={tick}>
                  <line
                    x1={padding.left}
                    x2={chartWidth - padding.right}
                    y1={y}
                    y2={y}
                    className="stroke-border"
                    strokeWidth="1"
                  />
                  <text
                    x={4}
                    y={y + 4}
                    className="fill-muted-foreground text-[10px]"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {polyline ? (
              <polyline
                points={polyline}
                fill="none"
                className={cn(
                  "stroke-brand",
                  seriesMode === "flat" ? "stroke-dasharray-[6_4]" : undefined,
                )}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ) : null}

            {startLabel && endLabel ? (
              <>
                <text
                  x={padding.left}
                  y={chartHeight - 8}
                  className="fill-muted-foreground text-[10px]"
                >
                  {formatAxisDate(startLabel)}
                </text>
                <text
                  x={chartWidth - padding.right}
                  y={chartHeight - 8}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px]"
                >
                  {formatAxisDate(endLabel)}
                </text>
              </>
            ) : null}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
