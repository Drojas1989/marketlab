import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/marketlab/page-shell";
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
    <PageShell mainClassName="flex items-center py-16">
      <Card className="w-full max-w-lg border-t-2 border-t-brand/40">
        <CardHeader className="items-center text-center">
          <Image
            src="/logo/iso-marketlab.webp"
            alt=""
            width={64}
            height={64}
            className="mb-2 size-12 object-contain dark:brightness-110"
          />
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            The market or page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/markets">Back to markets</Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
