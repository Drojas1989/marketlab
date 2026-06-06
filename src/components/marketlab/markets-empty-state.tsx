import { LayoutGrid } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MarketsEmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
          <LayoutGrid
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <CardTitle>No markets yet</CardTitle>
        <CardDescription className="max-w-md">
          Browse fictional Yes/No markets using fake money. Markets will appear
          here once they are available in the database.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/markets">Refresh markets</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
