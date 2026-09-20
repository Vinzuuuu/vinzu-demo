export const formatPrice = (price) => {
  if (price == null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

const REL = {
  en: { d: "d ago", h: "h ago", m: "m ago", now: "just now" },
  ro: { d: "z în urmă", h: "o în urmă", m: "m în urmă", now: "chiar acum" },
  fr: { d: "j", h: "h", m: "min", now: "à l'instant" },
};

export const timeAgo = (dateStr, lang = "en") => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const r = REL[lang] || REL.en;
  const days = Math.floor(diff / 86400000);
  if (days > 30) return new Date(dateStr).toLocaleDateString();
  if (days > 0) return `${days}${r.d}`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs > 0) return `${hrs}${r.h}`;
  const mins = Math.floor(diff / 60000);
  return mins > 0 ? `${mins}${r.m}` : r.now;
};
