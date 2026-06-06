import { Header } from "@/components/marketlab/header";
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
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto flex max-w-6xl justify-center px-4 py-10 sm:py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              Start with $100.00 fake money for the workshop markets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
