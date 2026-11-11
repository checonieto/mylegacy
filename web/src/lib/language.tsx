import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { content, type Lang } from "@/content";

const STORAGE_KEY = "living_memory_lang";
const LANGS: Lang[] = ["es", "en", "pt"];

function isLang(value: string | null | undefined): value is Lang {
  return !!value && (LANGS as string[]).includes(value);
}

function detectInitial(): Lang {
  if (typeof window === "undefined") return "es";
  const fromQuery = new URLSearchParams(window.location.search).get("lang");
  if (isLang(fromQuery)) return fromQuery;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLang(stored)) return stored;
  const nav = window.navigator.language.slice(0, 2).toLowerCase();
  return isLang(nav) ? nav : "es";
}

type LanguageContextValue = { lang: Lang; setLang: (lang: Lang) => void; t: (typeof content)[Lang] };

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitial);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: content[lang] }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export const languages = LANGS;
