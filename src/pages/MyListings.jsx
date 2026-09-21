import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage, useFormatPrice } from "@/lib/i18n";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function MyListings() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const formatPrice = useFormatPrice();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!user) return;
    setLoading(true);
    base44.entities.Listing.filter({ created_by_id: user.id }, "-created_date", 100)
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user]);

  const remove = async (id) => {
    if (!confirm(t("myListings.deleteConfirm"))) return;
    try {
      await base44.entities.Listing.delete(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast({ title: t("myListings.deleted") });
    } catch (err) {
      toast({ title: t("myListings.deleteFailed"), description: err.message, variant: "destructive" });
    }
  };

  const toggleStatus = async (listing) => {
    const next = listing.status === "sold" ? "active" : "sold";
    try {
      await base44.entities.Listing.update(listing.id, { status: next });
      setListings((prev) => prev.map((l) => (l.id === listing.id ? { ...l, status: next } : l)));
      toast({ title: next === "sold" ? t("myListings.markedSold") : t("myListings.relisted") });
    } catch (err) {
      toast({ title: t("myListings.updateFailed"), description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">{t("myListings.loading")}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("myListings.title")}</h1>
        <Link to="/post-ad">
          <Button><Plus className="w-4 h-4 mr-1" /> {t("myListings.postAd")}</Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border">
          <p className="text-lg text-muted-foreground mb-2">{t("myListings.none")}</p>
          <Link to="/post-ad" className="text-primary font-medium hover:underline">{t("myListings.first")}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l) => (
            <div key={l.id} className="bg-card border border-border overflow-hidden">
              <Link to={`/listing/${l.id}`}>
                <div className="aspect-[4/3] bg-muted relative">
                  {l.images?.[0] ? (
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">{t("myListings.noImage")}</div>
                  )}
                  {l.status === "sold" && (
                    <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1">{t("myListings.sold")}</div>
                  )}
                </div>
              </Link>
              <div className="p-3">
                <Link to={`/listing/${l.id}`} className="font-medium text-sm line-clamp-1 hover:text-primary">{l.title}</Link>
                <p className="font-bold text-primary">{formatPrice(l.price)}</p>
                <div className="flex gap-2 mt-3">
                  <Link to={`/post-ad?edit=${l.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full"><Pencil className="w-3.5 h-3.5 mr-1" /> {t("myListings.edit")}</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => toggleStatus(l)}>
                    {l.status === "sold" ? <RotateCcw className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => remove(l.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
