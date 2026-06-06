import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HeaderAuth } from "@/components/marketlab/header-auth";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";

const sampleProfile = {
  id: "user-1",
  balance_cents: 10000,
  first_name: "Ada",
  last_name: "Lovelace",
};

describe("HeaderAuth", () => {
  it("renders signed-out actions", () => {
    const html = renderToStaticMarkup(
      <HeaderAuth userId={null} profile={null} />,
    );

    expect(html).toContain("Sign in");
    expect(html).toContain("Sign up");
    expect(html).toContain('href="/sign-in"');
    expect(html).toContain('href="/sign-up"');
    expect(html).not.toContain("Sign out");
  });

  it("renders signed-in balance and sign out", () => {
    const html = renderToStaticMarkup(
      <HeaderAuth userId="user-1" profile={sampleProfile} />,
    );

    expect(html).toContain("$100.00 fake");
    expect(html).toContain("10,000 fake cents");
    expect(html).toContain("Sign out");
    expect(html).not.toContain("Sign in");
    expect(html).not.toContain("Sign up");
  });

  it("handles missing profile state", () => {
    const html = renderToStaticMarkup(
      <HeaderAuth userId="user-1" profile={null} />,
    );

    expect(html).toContain("Balance unavailable");
    expect(html).toContain("Sign out");
    expect(html).not.toContain("Sign in");
  });

  it("keeps theme toggle renderable beside auth UI", () => {
    const html = renderToStaticMarkup(
      <>
        <HeaderAuth userId={null} profile={null} />
        <ThemeToggle />
      </>,
    );

    expect(html).toContain("Switch to dark mode");
    expect(html).toContain("Sign in");
  });
});
