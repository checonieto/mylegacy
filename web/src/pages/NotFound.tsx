import { Link } from "react-router-dom";

import { useLanguage } from "@/lib/language";

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <span className="font-display text-6xl text-accent">❦</span>
      <h1 className="mt-4 text-6xl font-bold text-primary">404</h1>
      <Link to="/" className="mt-6 text-lg font-semibold text-primary underline decoration-accent underline-offset-4">
        {t.nav.home}
      </Link>
    </div>
  );
};

export default NotFound;
