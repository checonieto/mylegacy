import { useEffect, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { SUPPORT_EMAIL } from "@/content";
import { languages, useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export function Medallion({ size = 56 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-accent bg-card"
      style={{ width: size, height: size, boxShadow: "0 0 0 4px hsl(var(--background)), 0 0 0 5px hsl(var(--input))" }}
    >
      <img src="/logo-mark.png" alt="" className="h-[62%] w-[62%] object-contain" />
    </span>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/support", label: t.nav.support },
    { to: "/privacy", label: t.nav.privacy },
    { to: "/terms", label: t.nav.terms },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Medallion size={44} />
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold text-primary">{t.appName}</span>
              <span className="eyebrow !text-[10px]">{t.tagline}</span>
            </span>
          </Link>
          <div className="flex items-center gap-1 rounded-full border bg-muted p-1" role="group" aria-label="Language">
            {languages.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-semibold uppercase transition-colors",
                  lang === code ? "bg-primary text-primary-foreground shadow" : "text-primary/70 hover:text-primary",
                )}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 pb-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-full px-4 py-1.5 text-base transition-colors",
                  isActive ? "bg-secondary font-semibold text-primary" : "text-foreground/70 hover:bg-muted hover:text-primary",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-secondary/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-10 text-center">
          <span className="font-display text-3xl text-accent">❦</span>
          <p className="font-display text-xl italic text-primary">{t.footer}</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm font-semibold text-primary underline decoration-accent underline-offset-4">
            {SUPPORT_EMAIL}
          </a>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground/70">
            {links.slice(1).map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-primary">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">© 2026 {t.appName}</p>
        </div>
      </footer>
    </div>
  );
}
