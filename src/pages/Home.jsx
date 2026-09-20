import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/categories";
import { useLanguage } from "@/lib/i18n";
import { Car, Home as HomeIcon, Shirt, Smartphone, Sofa, Briefcase, Wrench, Store, PawPrint, Package } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";

const ROW_SIZE = 4; // columns per row at desktop
const INITIAL_ROWS = 5;
const PAGE_ROWS = 5;

export default function Home() {
  const { t } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);

  useEffect(() => {
    base44.entities.Listing.filter({ status: "active" }, "-created_date", 200)
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const visibleCount = visibleRows * ROW_SIZE;
  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = listings.length > visibleCount;
  const promoted = listings.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-3 text-primary-foreground/80 text-lg">
              {t("home.heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Promoted listings */}
      <section className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">{t("home.promoted")}</h2>
          <Link to="/category/all" className="text-sm text-primary font-medium hover:underline">{t("home.viewAll")}</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted animate-pulse" />
            ))}
          </div>
        ) : promoted.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {promoted.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">{t("home.noListings")}</p>
        )}
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-5">{t("home.browseCategories")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => {
            const iconMap = { Car, Home: HomeIcon, Shirt, Smartphone, Sofa, Briefcase, Wrench, Store, PawPrint, Package };
            const Icon = iconMap[cat.icon] || Package;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex flex-col items-center gap-3 p-5 bg-card hover:shadow-md transition-shadow group"
              >
                <Icon className="w-8 h-8" style={{ color: CATEGORY_COLORS[cat.id] }} />
                <span className="text-sm font-medium text-center text-foreground">{t(`categories.${cat.id}`)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured listings */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">{t("home.recentListings")}</h2>
          <Link to="/category/all" className="text-sm text-primary font-medium hover:underline">{t("home.viewAll")}</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">{t("home.noListings")}</p>
            <Link to="/post-ad" className="text-primary font-medium hover:underline">{t("home.beFirst")}</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {visibleListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  className="px-10"
                  onClick={() => setVisibleRows((r) => r + PAGE_ROWS)}
                >
                  {t("home.viewMore")}
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
