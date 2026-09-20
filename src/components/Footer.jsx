import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import AppStoreButtons from "@/components/AppStoreButtons";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        {/* Brand + tagline */}
        <div className="mb-8 max-w-md">
          <span className="text-xl font-bold text-foreground">Vinzu</span>
          <p className="text-sm text-muted-foreground mt-3">{t("footer.tagline")}</p>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-8">
          <FooterCol title={t("footer.company")} links={[
            { label: t("footer.about"), to: "/about" },
            { label: t("footer.sustainability"), to: "/about" },
            { label: t("footer.press"), to: "/about" },
            { label: t("footer.advertising"), to: "/contact" },
            { label: t("footer.accessibility"), to: "/contact" },
          ]} />
          <FooterCol title={t("footer.discover")} links={[
            { label: t("footer.howItWorks"), to: "/about" },
            { label: t("footer.mobileApps"), to: "/about" },
            { label: t("footer.dashboard"), to: "/my-listings" },
            { label: t("footer.platform"), to: "/about" },
          ]} />
          <FooterCol title={t("footer.help")} links={[
            { label: t("footer.helpCenter"), to: "/contact" },
            { label: t("footer.selling"), to: "/post-ad" },
            { label: t("footer.buying"), to: "/category/all" },
            { label: t("footer.trust"), to: "/terms" },
          ]} />
        </div>

        <div className="border-t border-border" />

        {/* Bottom utility bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6">
          {/* Social + app buttons (left) */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Linkedin} />
              <SocialIcon icon={Instagram} />
            </div>
            <div className="hidden md:block w-px h-8 bg-border mx-1" />
            <AppStoreButtons />
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">{t("footer.privacyCenter")}</Link>
            <Link to="/privacy" className="hover:text-foreground">{t("footer.cookiePolicy")}</Link>
            <Link to="/terms" className="hover:text-foreground">{t("footer.terms")}</Link>
            <Link to="/terms" className="hover:text-foreground">{t("footer.platform")}</Link>
          </div>
        </div>

        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          {t("footer.rights", { year })}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to} className="hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon: Icon }) {
  return (
    <a href="#" className="w-9 h-9 flex items-center justify-center border border-border hover:bg-muted transition-colors">
      <Icon className="w-4 h-4" />
    </a>
  );
}
