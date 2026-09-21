import { ProseContainer } from "@/components/ProseContainer";
import { useLanguage } from "@/lib/i18n";

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ProseContainer>
        <h1>{t("privacy.title")}</h1>
        <p className="text-muted-foreground">{t("privacy.updated")}</p>

        <h2>{t("privacy.s1")}</h2>
        <p>{t("privacy.s1p")}</p>

        <h2>{t("privacy.s2")}</h2>
        <p>{t("privacy.s2p")}</p>

        <h2>{t("privacy.s3")}</h2>
        <p>{t("privacy.s3p")}</p>

        <h2>{t("privacy.s4")}</h2>
        <p>{t("privacy.s4p")}</p>

        <h2>{t("privacy.s5")}</h2>
        <p>{t("privacy.s5p")}</p>

        <h2>{t("privacy.s6")}</h2>
        <p>{t("privacy.s6p")}</p>

        <h2>{t("privacy.s7")}</h2>
        <p>{t("privacy.s7p").split(t("privacy.contactLink")).map((part, i, arr) => (
          i < arr.length - 1 ? (
            <span key={i}>{part}<a href="/contact">{t("privacy.contactLink")}</a></span>
          ) : part
        ))}</p>
      </ProseContainer>
    </div>
  );
}
