import { Mail } from "lucide-react";

import LegalPage from "@/components/LegalPage";
import { SUPPORT_EMAIL } from "@/content";
import { useLanguage } from "@/lib/language";

export default function Support() {
  const { t } = useLanguage();
  return (
    <LegalPage eyebrow={t.appName} title={t.support.title} intro={t.support.intro} sections={t.support.sections} showDate={false}>
      <a
        href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t.appName)}`}
        className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <Mail className="h-5 w-5" />
        <span>
          {t.support.emailLabel} {SUPPORT_EMAIL}
        </span>
      </a>
    </LegalPage>
  );
}
