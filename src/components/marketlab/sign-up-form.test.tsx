import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: () => [{ needsEmailConfirmation: true }, vi.fn(), false],
  };
});

import { SignUpForm } from "@/components/marketlab/sign-up-form";

describe("SignUpForm", () => {
  it("shows check your email after signup without a session", () => {
    const html = renderToStaticMarkup(<SignUpForm />);

    expect(html).toContain("Check your email");
    expect(html).toContain("confirmation link");
    expect(html).toContain('href="/sign-in"');
  });
});
