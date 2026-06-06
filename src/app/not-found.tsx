import Link from "next/link";

import { Header } from "@/components/marketlab/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto flex max-w-6xl items-center px-4 py-16">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Page not found</CardTitle>
            <CardDescription>
              The market or page you are looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/markets">Back to markets</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
