"use client";

import Link from "next/link";
import { useActionState } from "react";

import { type AuthActionState, signIn } from "@/app/actions/auth";
import { AuthField } from "@/components/marketlab/auth-field";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState | null = null;

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, initialState);

  return (
    <form action={action} className="space-y-4">
      <AuthField
        id="sign-in-email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
      />
      <AuthField
        id="sign-in-password"
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
      />

      {state?.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Need an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
