import LegalPage from "@/components/LegalPage";
import { useLanguage } from "@/lib/language";

export default function Privacy() {
  const { t } = useLanguage();
  return <LegalPage eyebrow={t.appName} title={t.privacy.title} intro={t.privacy.intro} sections={t.privacy.sections} />;
}
