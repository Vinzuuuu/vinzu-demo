import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage, LANGS } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-10 px-2.5 text-primary-foreground hover:bg-black/10 transition-colors"
        aria-label="Language"
      >
        <Globe className="w-5 h-5" />
        <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-card text-card-foreground border border-border shadow-lg py-1 z-50">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-muted ${lang === l.code ? "font-semibold text-primary" : ""}`}
            >
              <span className="flex-1">{l.label}</span>
              {lang === l.code && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
