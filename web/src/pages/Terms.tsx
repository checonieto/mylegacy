import LegalPage from "@/components/LegalPage";
import { useLanguage } from "@/lib/language";

export default function Terms() {
  const { t } = useLanguage();
  return <LegalPage eyebrow={t.appName} title={t.terms.title} intro={t.terms.intro} sections={t.terms.sections} />;
}
