import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "vinzu_cookie_consent";

export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem(STORAGE_KEY);
    if (!choice) setVisible(true);
  }, []);

  const choose = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4">
      <div className="max-w-5xl mx-auto bg-card border border-border shadow-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("cookie.textPre")}
            <Link to="/privacy" className="text-primary font-medium hover:underline">{t("cookie.privacy")}</Link>
            {t("cookie.textMid")}
            <Link to="/terms" className="text-primary font-medium hover:underline">{t("cookie.terms")}</Link>
            {t("cookie.textPost")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={() => choose("rejected")}>
            {t("cookie.reject")}
          </Button>
          <Button size="sm" onClick={() => choose("accepted")}>
            {t("cookie.accept")}
          </Button>
          <button onClick={() => choose("rejected")} className="p-1.5 text-muted-foreground hover:text-foreground" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
