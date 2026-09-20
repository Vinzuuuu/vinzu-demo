import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage, useFilterLabel, useOption } from "@/lib/i18n";

export default function FilterPanel({ filters, values, onChange, onClear }) {
  const { t } = useLanguage();
  const fl = useFilterLabel();
  const op = useOption();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{t("category.filters")}</h3>
        <button onClick={onClear} className="text-xs text-primary hover:underline">{t("category.clearAll")}</button>
      </div>
      {filters.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label className="text-xs font-medium">{fl(f.label)}</Label>
          {f.type === "select" ? (
            <div className="relative">
              <select
                value={values[f.key] || ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                className="w-full h-10 pl-3 pr-9 text-sm border border-input bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {f.options.map((opt) => (
                  <option key={opt} value={opt === "Any" ? "" : opt}>{op(opt)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          ) : (
            <Input
              type={f.type === "number" ? "number" : "text"}
              value={values[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="h-10"
              placeholder={fl(f.label)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
