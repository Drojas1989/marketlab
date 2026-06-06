import { FakeMoneyNote } from "@/components/marketlab/fake-money-note";
import { PageShell } from "@/components/marketlab/page-shell";
import { SignInForm } from "@/components/marketlab/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInPage() {
  return (
    <PageShell mainClassName="flex justify-center py-10 sm:py-16">
      <Card className="w-full max-w-md border-t-2 border-t-brand/40">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Use your email and password to access your fake-money account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FakeMoneyNote />
          <SignInForm />
        </CardContent>
      </Card>
    </PageShell>
  );
}
