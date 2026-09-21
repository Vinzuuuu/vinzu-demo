import { ProseContainer } from "@/components/ProseContainer";
import { useLanguage } from "@/lib/i18n";

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ProseContainer>
        <h1>{t("terms.title")}</h1>
        <p className="text-muted-foreground">{t("terms.updated")}</p>

        <h2>{t("terms.s1")}</h2>
        <p>{t("terms.s1p")}</p>

        <h2>{t("terms.s2")}</h2>
        <p>{t("terms.s2p")}</p>

        <h2>{t("terms.s3")}</h2>
        <p>{t("terms.s3p")}</p>

        <h2>{t("terms.s4")}</h2>
        <p>{t("terms.s4p")}</p>

        <h2>{t("terms.s5")}</h2>
        <p>{t("terms.s5p")}</p>

        <h2>{t("terms.s6")}</h2>
        <p>{t("terms.s6p")}</p>

        <h2>{t("terms.s7")}</h2>
        <p>{t("terms.s7p")}</p>

        <h2>{t("terms.s8")}</h2>
        <p>{t("terms.s8p").split(t("terms.contactLink")).map((part, i, arr) => (
          i < arr.length - 1 ? (
            <span key={i}>{part}<a href="/contact">{t("terms.contactLink")}</a></span>
          ) : part
        ))}</p>
      </ProseContainer>
    </div>
  );
}
