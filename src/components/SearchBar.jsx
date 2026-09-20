import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, X, Search } from "lucide-react";
import { CATEGORIES, detectCategory } from "@/lib/categories";
import { useLanguage } from "@/lib/i18n";
import { Input } from "@/components/ui/input";

export default function SearchBar({ compact = false }) {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Smart category auto-detection while typing
  useEffect(() => {
    const detected = detectCategory(query);
    if (detected) setCategoryId(detected);
  }, [query]);

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    const path = categoryId === "all" ? `/category/all` : `/category/${categoryId}`;
    navigate(q ? `${path}?q=${encodeURIComponent(q)}` : path);
    setOpen(false);
  };

  const catName = (id) => (id === "all" ? t("search.allCategories") : t(`categories.${id}`));
  const selectedName = catName(categoryId);

  return (
    <form onSubmit={submit} className="flex w-full" ref={ref}>
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-11 flex items-center gap-1.5 pl-4 pr-2.5 text-sm font-medium border border-r-0 border-border bg-muted hover:bg-muted/70 transition-colors"
        >
          <span className={compact ? "hidden sm:inline" : "inline"}>{selectedName}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border shadow-lg z-50 py-1 max-h-80 overflow-y-auto">
            <button
              type="button"
              onClick={() => { setCategoryId("all"); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted font-medium"
            >
              {t("search.allCategories")}
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { setCategoryId(c.id); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${categoryId === c.id ? "font-semibold text-primary" : ""}`}
              >
                {t(`categories.${c.id}`)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="h-11 pl-10 pr-10 border-l-0"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
