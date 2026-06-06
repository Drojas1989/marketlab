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
      <CardHeader>
        <CardTitle>No markets yet</CardTitle>
        <CardDescription>
          Browse fictional Yes/No markets using fake money. Markets will appear
          here once they are available in the database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link href="/markets">Refresh markets</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
