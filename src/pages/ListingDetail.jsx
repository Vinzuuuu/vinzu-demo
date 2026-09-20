import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage, useFormatPrice } from "@/lib/i18n";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/lib/categories";
import { timeAgo } from "@/lib/format";
import ListingCard from "@/components/ListingCard";
import { MapPin, Tag, MessageSquare, ArrowLeft, Star, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t, lang } = useLanguage();
  const formatPrice = useFormatPrice();
  const [listing, setListing] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");

  useEffect(() => {
    setLoading(true);
    base44.entities.Listing.get(id)
      .then((l) => {
        setListing(l);
        if (l?.category) {
          base44.entities.Listing.filter({ status: "active", category: l.category }, "-created_date", 5)
            .then((items) => setRelated(items.filter((x) => x.id !== l.id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">{t("listing.loading")}</div>;
  }
  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">{t("listing.unavailable")}</p>
        <Link to="/" className="text-primary font-medium hover:underline">{t("listing.backHome")}</Link>
      </div>
    );
  }

  const category = getCategory(listing.category);
  const isOwner = user && listing.created_by_id === user.id;
  const images = listing.images || [];
  const catName = category ? t(`categories.${category.id}`) : "";

  const startConversation = async (initialText) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (isOwner) return;
    const existing = await base44.entities.Conversation.filter({ listing_id: listing.id }, "-last_message_date", 50);
    const conv = existing.find((c) => c.participant_ids?.includes(user.id));
    let convId;
    if (conv) {
      convId = conv.id;
    } else {
      const created = await base44.entities.Conversation.create({
        listing_id: listing.id,
        listing_title: listing.title,
        listing_image: images[0] || "",
        participant_ids: [user.id, listing.created_by_id],
        last_message: "",
      });
      convId = created.id;
    }
    if (initialText) {
      await base44.entities.Message.create({
        conversation_id: convId,
        sender_id: user.id,
        sender_name: user.full_name || "You",
        text: initialText,
        read: false,
      });
      await base44.entities.Conversation.update(convId, {
        last_message: initialText,
        last_message_date: new Date().toISOString(),
      });
    }
    navigate(`/messages?c=${convId}`);
  };

  const sendOffer = () => {
    if (!offerAmount) return;
    startConversation(`${offerAmount}`);
  };

  const attrs = listing.attributes || {};
  const attrEntries = Object.entries(attrs).filter(([, v]) => v);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link to={category ? `/category/${listing.category}` : "/"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {t("listing.backTo", { name: catName || t("category.browse").toLowerCase() })}
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/3] bg-muted overflow-hidden relative">
            {images.length > 0 ? (
              <Image src={images[activeImg]} alt={listing.title} className="w-full h-full" fittingType="fill" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">{t("listing.noImage")}</div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 overflow-hidden flex-shrink-0 border-2 ${activeImg === i ? "border-primary" : "border-transparent"}`}
                >
                  <Image src={img} alt="" className="w-full h-full" fittingType="fill" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {category && (
            <Link to={`/category/${listing.category}`} className="text-sm text-primary font-medium hover:underline">
              {catName}{listing.subcategory ? ` · ${t(`subcats.${listing.subcategory}`) === listing.subcategory ? listing.subcategory : t(`subcats.${listing.subcategory}`)}` : ""}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{listing.title}</h1>
          <p className="text-3xl font-extrabold text-primary mt-3">{formatPrice(listing.price)}</p>
          {listing.negotiable && <p className="text-sm text-muted-foreground mt-1">{t("listing.negotiable")}</p>}

          <div className="flex flex-wrap gap-3 mt-4 text-sm text-muted-foreground">
            {listing.condition && <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {t(`options.${listing.condition}`) === listing.condition ? listing.condition : t(`options.${listing.condition}`)}</span>}
            {listing.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {listing.location}</span>}
            <span>{t("listing.posted", { ago: timeAgo(listing.created_date, lang) })}</span>
          </div>

          {attrEntries.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 p-4 bg-muted/50">
              {attrEntries.map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-muted-foreground capitalize">{k.replace(/_/g, " ")}</p>
                  <p className="text-sm font-medium">{String(v)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Seller card */}
          <div className="mt-6 p-4 border border-border flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {(listing.seller_name || "S")[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{listing.seller_name || t("listing.seller")}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3" /> {t("listing.memberSince", { year: new Date(listing.created_date).getFullYear() })}
              </p>
            </div>
            <Link to={`/profile/${listing.created_by_id}`}>
              <Button variant="outline" size="sm">{t("listing.viewProfile")}</Button>
            </Link>
          </div>

          {/* Actions */}
          {!isOwner ? (
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 h-12" onClick={() => startConversation()}>
                <MessageSquare className="w-4 h-4 mr-2" /> {t("listing.contactSeller")}
              </Button>
              {listing.negotiable && (
                <Button variant="outline" className="flex-1 h-12" onClick={() => setOfferOpen((o) => !o)}>
                  {t("listing.makeOffer")}
                </Button>
              )}
            </div>
          ) : (
            <div className="mt-5 p-4 bg-primary/5 text-sm text-center">
              <ShieldCheck className="w-5 h-5 mx-auto text-primary mb-1" />
              {t("listing.yourListing")}{" "}
              <Link to="/my-listings" className="text-primary font-medium hover:underline">{t("listing.manage")}</Link>
            </div>
          )}

          {offerOpen && (
            <div className="mt-3 p-4 border border-border flex gap-2">
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder={t("listing.offerAmount")}
                className="flex-1 h-11 px-3 border border-input bg-background"
              />
              <Button onClick={sendOffer} disabled={!offerAmount}>{t("listing.sendOffer")}</Button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 p-5 bg-card border border-border">
        <h2 className="font-bold mb-2">{t("listing.description")}</h2>
        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{listing.description || t("listing.noDescription")}</p>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">{t("listing.similar")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
