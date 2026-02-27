import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

const links = [
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

const themeStorageKey = "portfolio_theme";

const ThemeToggle = ({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) => {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Night mode switch"
      onClick={onToggle}
      className={[
        "relative h-10 w-[4.75rem] overflow-hidden rounded-full border p-1 transition-all duration-500",
        isDark
          ? "border-border/70 bg-gradient-to-r from-foreground to-foreground/80"
          : "border-primary/30 bg-gradient-to-r from-secondary/70 to-secondary/35",
      ].join(" ")}
    >
      {isDark ? (
        <>
          <span className="pointer-events-none absolute left-2 top-2 h-1 w-1 rounded-full bg-background/90" />
          <span className="pointer-events-none absolute left-5 top-4 h-1 w-1 rounded-full bg-background/70" />
          <span className="pointer-events-none absolute right-4 top-3 h-1.5 w-1.5 rounded-full bg-background/80" />
          <span className="pointer-events-none absolute right-6 top-7 h-1 w-1 rounded-full bg-background/60" />
        </>
      ) : (
        <>
          <span className="pointer-events-none absolute bottom-1 left-2 h-4 w-6 rounded-full bg-background/85" />
          <span className="pointer-events-none absolute bottom-1 left-6 h-5 w-7 rounded-full bg-background/90" />
          <span className="pointer-events-none absolute bottom-1 right-2 h-4 w-6 rounded-full bg-background/85" />
        </>
      )}

      <span
        className={[
          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-transform duration-500",
          isDark
            ? "translate-x-[2.2rem] bg-background text-foreground"
            : "translate-x-0 bg-accent text-accent-foreground",
        ].join(" ")}
      >
        {isDark ? (
          <span className="relative flex h-6 w-6 items-center justify-center">
            <Moon className="h-4 w-4" />
            <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-foreground/30" />
            <span className="absolute bottom-1 left-0 h-1 w-1 rounded-full bg-foreground/25" />
          </span>
        ) : (
          <span className="relative flex h-6 w-6 items-center justify-center">
            <Sun className="h-4 w-4" />
            <span className="absolute h-6 w-6 rounded-full ring-2 ring-accent/30" />
          </span>
        )}
      </span>
    </button>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const setThemeMode = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem(themeStorageKey, nextTheme);
  };

  const toggleTheme = () => {
    setThemeMode(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="sticky top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="text-lg font-semibold tracking-tight text-foreground">
            Yared Abebe
          </a>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 text-foreground md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <a
              href="#contact"
              className="hidden rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10 md:inline-flex"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-border/60 px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-3 text-sm">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                className="mt-1 inline-flex w-fit rounded-full border border-primary/40 px-4 py-2 font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10"
                onClick={closeMenu}
              >
                Get in Touch
              </a>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navigation;
