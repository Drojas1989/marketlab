import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PositionsEmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>No positions yet</CardTitle>
        <CardDescription>
          Buy Yes or No fake shares from an open market to see your positions
          here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link href="/markets">Browse markets</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
