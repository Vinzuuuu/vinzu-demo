import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import { getCategory } from "@/lib/categories";
import { useLanguage, useFormatPrice } from "@/lib/i18n";

export default function ListingCard({ listing }) {
  const { t } = useLanguage();
  const formatPrice = useFormatPrice();
  const cat = getCategory(listing.category);
  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group flex flex-col bg-card border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full"
            fittingType="fill"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            {t("listing.noImage")}
          </div>
        )}
        {listing.status === "sold" && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1">
            {t("listing.sold")}
          </div>
        )}
        {cat && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 backdrop-blur-sm">
            {t(`categories.${cat.id}`)}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="font-bold text-lg text-primary">{formatPrice(listing.price)}</p>
        <h3 className="text-sm font-medium line-clamp-2 mt-1 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>
        {listing.location && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <MapPin className="w-3 h-3" /> {listing.location}
          </p>
        )}
      </div>
    </Link>
  );
}
