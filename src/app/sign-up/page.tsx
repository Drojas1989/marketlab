import { FakeMoneyNote } from "@/components/marketlab/fake-money-note";
import { PageShell } from "@/components/marketlab/page-shell";
import { SignUpForm } from "@/components/marketlab/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <PageShell mainClassName="flex justify-center py-10 sm:py-16">
      <Card className="w-full max-w-md border-t-2 border-t-brand/40">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Start with $100.00 fake money for the workshop markets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FakeMoneyNote />
          <SignUpForm />
        </CardContent>
      </Card>
    </PageShell>
  );
}
