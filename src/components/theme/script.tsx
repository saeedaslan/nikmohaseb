import Script from "next/script";

export const THEME_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark;
    if (stored === "dark" || stored === "light") {
      dark = stored === "dark";
    } else {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {
    void e;
  }
})();`;

export function ThemeScript() {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  );
}
