import type { ReactNode } from "react";

import type { Section } from "@/content";
import { EFFECTIVE_DATE } from "@/content";
import { useLanguage } from "@/lib/language";

type Props = { eyebrow: string; title: string; intro: string; sections: Section[]; showDate?: boolean; children?: ReactNode };

export default function LegalPage({ eyebrow, title, intro, sections, showDate = true, children }: Props) {
  const { lang, t } = useLanguage();
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-5xl font-bold leading-tight text-primary sm:text-6xl">{title}</h1>
      {showDate && (
        <p className="mt-3 text-sm text-muted-foreground">
          {t.effective}: {EFFECTIVE_DATE[lang]}
        </p>
      )}
      <p className="mt-6 text-xl text-foreground/85">{intro}</p>
      {children}
      <div className="heirloom-card prose-legal mt-10 border-l-4 border-l-accent px-6 py-4 sm:px-10 sm:py-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
            {s.bullets && (
              <ul>
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
