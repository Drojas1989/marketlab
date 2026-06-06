"use client";

import Link from "next/link";
import { useActionState } from "react";

import { type AuthActionState, signUp } from "@/app/actions/auth";
import { AuthField } from "@/components/marketlab/auth-field";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState | null = null;

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, initialState);

  if (state?.needsEmailConfirmation) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
        <p className="font-medium text-foreground">Check your email</p>
        <p className="text-muted-foreground">
          We sent a confirmation link. Open it to finish creating your account,
          then sign in.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          id="sign-up-first-name"
          label="First name"
          name="first_name"
          autoComplete="given-name"
        />
        <AuthField
          id="sign-up-last-name"
          label="Last name"
          name="last_name"
          autoComplete="family-name"
        />
      </div>
      <AuthField
        id="sign-up-email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
      />
      <AuthField
        id="sign-up-password"
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
      />

      {state?.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Sign up"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
