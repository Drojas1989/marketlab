import { Briefcase } from "lucide-react";
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
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
          <Briefcase
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <CardTitle>No positions yet</CardTitle>
        <CardDescription className="max-w-md">
          Buy Yes or No fake shares from an open market to see your positions
          here.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/markets">Browse markets</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
