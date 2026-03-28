export function applyTheme(mode, theme) {
  const root = document.documentElement;

  root.classList.remove("dark");
  root.classList.remove(
    "theme-bigBusiness",
    "theme-chillVibes",
    "theme-fallingLeaves",
    "theme-purpleNight",
    "theme-oceanBlue",
    "theme-pinkBlossom",
    "theme-iceBlue",
    "theme-forest",
    "theme-sunset",
    "theme-midnight",
    "theme-rose",
    "theme-neon",
    "theme-cosmic",
    "theme-spike"
  );

  if (mode === "dark") {
    root.classList.add("dark");
  } else if (mode === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", isDark);
  }

  if (theme) {
    root.classList.add(`theme-${theme}`);
  }
}
