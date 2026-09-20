import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { getCategory } from "@/lib/categories";
import { useLanguage, useFilterLabel, useOption } from "@/lib/i18n";
import ListingCard from "@/components/ListingCard";
import FilterPanel from "@/components/FilterPanel";
import CategoryIcon from "@/components/CategoryIcon";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export default function Category() {
  const { t } = useLanguage();
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = getCategory(categoryId);
  const isAll = categoryId === "all";

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [subcategory, setSubcategory] = useState("");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const q = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    const query = isAll ? { status: "active" } : { status: "active", category: categoryId };
    base44.entities.Listing.filter(query, "-created_date", 200)
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [categoryId, isAll]);

  const activeFilters = isAll
    ? [
        { key: "price_min", label: "Min price", type: "number" },
        { key: "price_max", label: "Max price", type: "number" },
        { key: "location", label: "Location", type: "text" },
      ]
    : category?.filters || [];

  const filtered = useMemo(() => {
    let result = [...listings];
    if (q) {
      const ql = q.toLowerCase();
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(ql) ||
          l.description?.toLowerCase().includes(ql)
      );
    }
    if (subcategory) result = result.filter((l) => l.subcategory === subcategory);

    Object.entries(filters).forEach(([key, val]) => {
      if (!val) return;
      if (key === "price_min") result = result.filter((l) => l.price >= Number(val));
      else if (key === "price_max") result = result.filter((l) => l.price <= Number(val));
      else if (key === "salary_min") result = result.filter((l) => l.price >= Number(val));
      else if (key === "salary_max") result = result.filter((l) => l.price <= Number(val));
      else if (key === "year_min") result = result.filter((l) => Number(l.attributes?.year || 0) >= Number(val));
      else if (key === "mileage_max") result = result.filter((l) => Number(l.attributes?.mileage || Infinity) <= Number(val));
      else if (key === "sqm_min") result = result.filter((l) => Number(l.attributes?.sqm || 0) >= Number(val));
      else if (key === "seller_rating") {
        const min = val === "4.5+" ? 4.5 : 4;
        result = result.filter((l) => Number(l.attributes?.seller_rating || 0) >= min);
      } else if (key === "location") {
        const vl = val.toLowerCase();
        result = result.filter((l) => l.location?.toLowerCase().includes(vl));
      } else if (key === "condition") {
        result = result.filter((l) => l.condition === val);
      } else {
        const vl = String(val).toLowerCase();
        result = result.filter((l) => {
          const attr = l.attributes?.[key] || l[key];
          return attr != null && String(attr).toLowerCase().includes(vl);
        });
      }
    });

    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [listings, q, subcategory, filters, sort]);

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const clearFilters = () => { setFilters({}); setSubcategory(""); };

  const title = isAll ? (q ? t("category.resultsFor", { q }) : t("category.allListings")) : (category ? t(`categories.${category.id}`) : t("category.browse"));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb + title */}
      <div className="mb-4">
        <div className="text-sm text-muted-foreground mb-1">
          <Link to="/" className="hover:underline">{t("category.home")}</Link>
          {" / "}
          <span>{isAll ? t("category.allListings") : (category ? t(`categories.${category.id}`) : "")}</span>
        </div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {!isAll && <CategoryIcon name={category?.icon} className="w-6 h-6 text-primary" />}
          {title}
        </h1>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters - desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-card border border-border p-4 sticky top-20">
            {!isAll && category.subcategories.length > 0 && (
              <div className="mb-5 pb-5 border-b border-border">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">{t("category.type")}</h3>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSubcategory("")}
                    className={`text-xs px-2.5 py-1 border ${!subcategory ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
                  >
                    {t("category.all")}
                  </button>
                  {category.subcategories.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSubcategory(s)}
                      className={`text-xs px-2.5 py-1 border ${subcategory === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
                    >
                      {t(`subcats.${s}`) === s ? s : t(`subcats.${s}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <FilterPanel filters={activeFilters} values={filters} onChange={setFilter} onClear={clearFilters} />
          </div>
        </aside>

        {/* Listings */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <button
              onClick={() => setShowFiltersMobile((o) => !o)}
              className="md:hidden flex items-center gap-1.5 text-sm font-medium px-3 py-2 border border-border"
            >
              <SlidersHorizontal className="w-4 h-4" /> {t("category.filters")}
            </button>
            <p className="text-sm text-muted-foreground hidden sm:block">{filtered.length} {t("category.results")}</p>
            <div className="relative ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 pl-3 pr-9 text-sm border border-input bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="newest">{t("category.newest")}</option>
                <option value="price_asc">{t("category.priceAsc")}</option>
                <option value="price_desc">{t("category.priceDesc")}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Mobile filters */}
          {showFiltersMobile && (
            <div className="md:hidden mb-4 bg-card border border-border p-4">
              {!isAll && category.subcategories.length > 0 && (
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => setSubcategory("")} className={`text-xs px-2.5 py-1 border ${!subcategory ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{t("category.all")}</button>
                    {category.subcategories.map((s) => (
                      <button key={s} onClick={() => setSubcategory(s)} className={`text-xs px-2.5 py-1 border ${subcategory === s ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{t(`subcats.${s}`) === s ? s : t(`subcats.${s}`)}</button>
                    ))}
                  </div>
                </div>
              )}
              <FilterPanel filters={activeFilters} values={filters} onChange={setFilter} onClear={clearFilters} />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg mb-2">{t("category.noResults")}</p>
              <p>{t("category.noResultsHint")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
