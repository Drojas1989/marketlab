export function formatFakeDollars(cents: number): string {
  const dollars = cents / 100;

  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars)} fake`;
}

export function formatFakeBalanceCents(cents: number): string {
  return `${cents.toLocaleString("en-US")} fake cents`;
}

export function formatFakeShares(cents: number): string {
  return formatFakeDollars(cents);
}

export type ParseFakeDollarResult =
  | { ok: true; cents: number }
  | { ok: false; error: string };

export function parseFakeDollarInput(value: string): ParseFakeDollarResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "Enter a fake dollar amount." };
  }

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return {
      ok: false,
      error: "Use a valid fake dollar amount with up to two decimal places.",
    };
  }

  const [wholePart, fractionPart = ""] = trimmed.split(".");
  const dollars = Number.parseInt(wholePart, 10);
  const centsPart = fractionPart.padEnd(2, "0");
  const cents = Number.parseInt(centsPart, 10);
  const totalCents = dollars * 100 + cents;

  if (totalCents <= 0) {
    return { ok: false, error: "Amount must be greater than zero." };
  }

  return { ok: true, cents: totalCents };
}

export function isValidPositionSide(value: string): value is "yes" | "no" {
  return value === "yes" || value === "no";
}
