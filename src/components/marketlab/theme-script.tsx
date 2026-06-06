export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem("theme");
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
        document.documentElement.classList.toggle("dark", theme === "dark");
      } catch (e) {}
    })();
  `;

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: inline theme bootstrap before hydration
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
