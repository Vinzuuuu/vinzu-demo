import { ProseContainer } from "@/components/ProseContainer";
import { useLanguage } from "@/lib/i18n";

export default function About() {
  const { t } = useLanguage();
  const items = t("about.items");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ProseContainer>
        <h1>{t("about.title")}</h1>
        <p>{t("about.intro")}</p>
        <h2>{t("about.what")}</h2>
        <ul>
          {Array.isArray(items) ? items.map((it, i) => <li key={i}>{it}</li>) : null}
        </ul>
        <h2>{t("about.mission")}</h2>
        <p>{t("about.missionText")}</p>
      </ProseContainer>
    </div>
  );
}
