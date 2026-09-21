import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage, useFilterLabel, useOption, useFormatPrice } from "@/lib/i18n";
import { CATEGORIES, getCategory } from "@/lib/categories";
import CategoryIcon from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, X, Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const EXCLUDE_KEYS = new Set(["price_min", "price_max", "salary_min", "salary_max", "location", "condition"]);

const attrFieldsFor = (category) => {
  if (!category) return [];
  return category.filters.filter((f) => !EXCLUDE_KEYS.has(f.key));
};

export default function PostAd() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { user } = useAuth();
  const { t } = useLanguage();
  const fl = useFilterLabel();
  const op = useOption();
  const formatPrice = useFormatPrice();
  const fileRef = useRef(null);

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "used",
    location: "",
    negotiable: false,
  });
  const [attributes, setAttributes] = useState({});
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      base44.entities.Listing.get(editId)
        .then((l) => {
          if (l && l.created_by_id === user?.id) {
            setCategory(getCategory(l.category));
            setSubcategory(l.subcategory || "");
            setForm({
              title: l.title || "",
              description: l.description || "",
              price: l.price ?? "",
              condition: l.condition || "used",
              location: l.location || "",
              negotiable: !!l.negotiable,
            });
            setAttributes(l.attributes || {});
            setPhotos((l.images || []).map((url) => ({ src: url, file: null, isExisting: true })));
          }
        })
        .finally(() => setLoadingEdit(false));
    }
  }, [editId, user]);

  const attrFields = attrFieldsFor(category);

  const onPickFiles = (files) => {
    const arr = Array.from(files).slice(0, 8 - photos.length);
    const newPhotos = arr.map((f) => ({ src: URL.createObjectURL(f), file: f, isExisting: false }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 8));
  };

  const removePhoto = (i) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  };

  const canNext = () => {
    if (step === 1) return !!category;
    if (step === 2) return form.title && form.price && form.location;
    return true;
  };

  const publish = async () => {
    setUploading(true);
    try {
      let imageUrls = [];
      for (const p of photos) {
        if (p.isExisting) {
          imageUrls.push(p.src);
        } else {
          const { file_url } = await base44.integrations.Core.UploadPublicFile({ file: p.file });
          imageUrls.push(file_url);
        }
      }

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: category.id,
        subcategory,
        condition: form.condition,
        location: form.location,
        negotiable: form.negotiable,
        attributes,
        images: imageUrls,
        seller_name: user?.full_name || "",
        status: "active",
      };

      if (editId) {
        await base44.entities.Listing.update(editId, payload);
        toast({ title: t("postAd.updated") });
      } else {
        await base44.entities.Listing.create(payload);
        toast({ title: t("postAd.published") });
      }
      navigate("/my-listings");
    } catch (err) {
      toast({ title: t("postAd.failed"), description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (loadingEdit) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-muted-foreground">{t("postAd.loading")}</div>;
  }

  const steps = t("postAd.steps");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{editId ? t("postAd.editTitle") : t("postAd.title")}</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 flex items-center justify-center text-sm font-semibold border-2 ${active ? "bg-primary text-primary-foreground border-primary" : done ? "bg-primary/10 text-primary border-primary" : "bg-card text-muted-foreground border-border"}`}>
                  {done ? <Check className="w-4 h-4" /> : n}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > n ? "bg-primary" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Category */}
      {step === 1 && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">{t("postAd.chooseCategory")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCategory(c); setSubcategory(""); }}
                className={`flex items-center gap-3 p-3 border text-left transition-all ${category?.id === c.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
              >
                <CategoryIcon name={c.icon} className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{t(`categories.${c.id}`)}</span>
              </button>
            ))}
          </div>
          {category && category.subcategories.length > 0 && (
            <div className="mt-6">
              <Label className="mb-2 block">{t("postAd.subcategory")}</Label>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubcategory(s)}
                    className={`text-sm px-3 py-1.5 border ${subcategory === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
                  >
                    {t(`subcats.${s}`) === s ? s : t(`subcats.${s}`)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">{t("postAd.titleLabel")}</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t("postAd.titlePlaceholder")} className="h-11" />
          </div>
          <div>
            <Label htmlFor="desc">{t("postAd.description")}</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} placeholder={t("postAd.descPlaceholder")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">{t("postAd.price")}</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" className="h-11" />
            </div>
            <div>
              <Label htmlFor="condition">{t("postAd.condition")}</Label>
              <select
                id="condition"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full h-11 px-3 text-sm border border-input bg-background appearance-none"
              >
                <option value="used">{t("postAd.used")}</option>
                <option value="new">{t("postAd.new")}</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="location">{t("postAd.location")}</Label>
            <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder={t("postAd.locationPlaceholder")} className="h-11" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.negotiable} onChange={(e) => setForm({ ...form, negotiable: e.target.checked })} className="w-4 h-4 accent-primary" />
            <span className="text-sm">{t("postAd.negotiable")}</span>
          </label>

          {attrFields.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-semibold mb-3">{t("postAd.details", { name: category ? t(`categories.${category.id}`) : "" })}</p>
              <div className="grid grid-cols-2 gap-4">
                {attrFields.map((f) => (
                  <div key={f.key}>
                    <Label className="text-xs">{fl(f.label)}</Label>
                    {f.type === "select" ? (
                      <select
                        value={attributes[f.key] || ""}
                        onChange={(e) => setAttributes({ ...attributes, [f.key]: e.target.value })}
                        className="w-full h-10 px-3 text-sm border border-input bg-background appearance-none"
                      >
                        <option value="">{t("postAd.any")}</option>
                        {f.options.filter((o) => o !== "Any").map((o) => (
                          <option key={o} value={o}>{op(o)}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={f.type === "number" ? "number" : "text"}
                        value={attributes[f.key] || ""}
                        onChange={(e) => setAttributes({ ...attributes, [f.key]: e.target.value })}
                        className="h-10"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Photos */}
      {step === 3 && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">{t("postAd.addPhotos")}</p>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">{t("postAd.clickUpload")}</p>
            <p className="text-xs text-muted-foreground">{t("postAd.uploadHint")}</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { onPickFiles(e.target.files); e.target.value = ""; }}
            />
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {photos.map((p, i) => (
                <div key={i} className="relative aspect-square overflow-hidden border border-border group">
                  <img src={p.src} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5">{t("postAd.cover")}</span>}
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-card border border-border p-5">
            <div className="flex gap-4">
              {photos[0] && (
                <img src={photos[0].src} alt="" className="w-24 h-24 object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{form.title || t("postAd.untitled")}</h3>
                <p className="text-2xl font-extrabold text-primary">{formatPrice(form.price || 0)}</p>
                <p className="text-sm text-muted-foreground">{category ? t(`categories.${category.id}`) : ""}{subcategory ? ` · ${t(`subcats.${subcategory}`) === subcategory ? subcategory : t(`subcats.${subcategory}`)}` : ""} · {form.condition === "new" ? t("postAd.new") : t("postAd.used")} · {form.location}</p>
              </div>
            </div>
            {form.description && <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">{form.description}</p>}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              {t("postAd.agreePre")}
              <Link to="/terms" className="text-primary hover:underline">{t("postAd.termsLink")}</Link>
              {t("postAd.agreeMid")}
              <Link to="/privacy" className="text-primary hover:underline">{t("postAd.privacyLink")}</Link>
              {t("postAd.agreePost")}
            </p>
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))} disabled={uploading}>
          <ChevronLeft className="w-4 h-4 mr-1" /> {step > 1 ? t("postAd.back") : t("postAd.cancel")}
        </Button>
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
            {t("postAd.continue")} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={publish} disabled={uploading}>
            {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("postAd.publishing")}</> : editId ? t("postAd.saveChanges") : t("postAd.publish")}
          </Button>
        )}
      </div>
    </div>
  );
}
