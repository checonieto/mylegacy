import { BookOpen, Camera, LifeBuoy, Mic, ScrollText, ShieldCheck, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Medallion } from "@/components/SiteLayout";
import { useLanguage } from "@/lib/language";

const featureIcons = [Volume2, Mic, Camera, BookOpen];

export default function Index() {
  const { lang, t } = useLanguage();
  const linkCards = [
    { to: "/support", label: t.nav.support, icon: LifeBuoy },
    { to: "/privacy", label: t.nav.privacy, icon: ShieldCheck },
    { to: "/terms", label: t.nav.terms, icon: ScrollText },
  ];

  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-14 sm:py-20 md:grid-cols-[1.15fr_1fr]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Medallion size={84} />
          <p className="eyebrow mt-8">{t.home.eyebrow}</p>
          <h1 className="mt-3 text-5xl font-bold leading-[1.05] text-primary sm:text-6xl">{t.home.title}</h1>
          <p className="mt-6 text-xl text-foreground/85">{t.home.intro}</p>
          <p className="mt-8 border-l-4 border-accent pl-4 font-display text-2xl italic text-primary/90">{t.home.quote}</p>
        </div>

        <div className="relative mx-auto h-[520px] w-full max-w-[380px]">
          <img
            src={`/shots/${lang}-book.jpg`}
            alt=""
            className="absolute right-0 top-10 w-[58%] rotate-[5deg] rounded-[2rem] border-4 border-card shadow-2xl transition-transform duration-500 hover:rotate-[2deg]"
          />
          <img
            src={`/shots/${lang}-questions.jpg`}
            alt={t.appName}
            className="absolute left-0 top-0 w-[62%] -rotate-[4deg] rounded-[2rem] border-4 border-card shadow-2xl transition-transform duration-500 hover:-rotate-[1deg]"
          />
        </div>
      </section>

      <section className="bg-secondary/50 py-14">
        <div className="mx-auto grid max-w-5xl gap-5 px-5 sm:grid-cols-2">
          {t.home.features.map((f, i) => {
            const Icon = featureIcons[i] ?? BookOpen;
            return (
              <div key={f.title} className="heirloom-card flex gap-4 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-2xl font-semibold text-primary">{f.title}</h3>
                  <p className="text-foreground/80">{f.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-4xl font-bold text-primary">{t.home.linksTitle}</h2>
        <p className="mt-2 text-lg text-foreground/80">{t.home.linksText}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {linkCards.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="heirloom-card group flex items-center gap-4 p-6 transition-transform hover:-translate-y-1 active:scale-[0.98]"
            >
              <Icon className="h-7 w-7 text-accent" />
              <span className="font-display text-2xl font-semibold text-primary group-hover:underline">{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
