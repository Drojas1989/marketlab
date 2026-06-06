export function formatFakeBalance(balanceCents: number): string {
  const dollars = balanceCents / 100;

  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars)} fake`;
}

export function formatFakeBalanceCents(balanceCents: number): string {
  return `${balanceCents.toLocaleString("en-US")} fake cents`;
}
