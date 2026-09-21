import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ListingCard from "@/components/ListingCard";
import { formatPrice } from "@/lib/format";
import { Star, MapPin, Phone, Pencil, Loader2, Camera } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { t, lang } = useLanguage();
  const targetId = userId || currentUser?.id;
  const isOwn = !userId || userId === currentUser?.id;

  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [sold, setSold] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", location: "", phone: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);

  const tabs = t("profile.tabs");

  useEffect(() => {
    if (!targetId) return;
    setLoading(true);
    Promise.all([
      base44.entities.User.get(targetId).catch(() => null),
      base44.entities.Listing.filter({ created_by_id: targetId, status: "active" }, "-created_date", 50).catch(() => []),
      base44.entities.Listing.filter({ created_by_id: targetId, status: "sold" }, "-created_date", 50).catch(() => []),
      base44.entities.Review.filter({ reviewee_id: targetId }, "-created_date", 50).catch(() => []),
    ]).then(([u, act, sld, rev]) => {
      const activeListings = act || [];
      const profileData = u || {
        id: targetId,
        full_name: activeListings[0]?.seller_name || "Vinzu member",
        created_date: activeListings[0]?.created_date || new Date().toISOString(),
        rating_avg: 0,
        rating_count: 0,
      };
      setProfile(profileData);
      setListings(activeListings);
      setSold(sld || []);
      setReviews(rev || []);
      if (isOwn && u) setEditForm({ bio: u.bio || "", location: u.location || "", phone: u.phone || "", avatar_url: u.avatar_url || "" });
    }).finally(() => setLoading(false));
  }, [targetId, isOwn]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe(editForm);
      setProfile((p) => ({ ...p, ...editForm }));
      setEditing(false);
      toast({ title: t("profile.updated") });
    } catch (err) {
      toast({ title: t("profile.updateFailed"), description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setEditForm((f) => ({ ...f, avatar_url: file_url }));
    } catch (err) {
      toast({ title: t("profile.uploadFailed"), description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-muted-foreground">{t("profile.loading")}</div>;
  if (!profile) return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-muted-foreground">{t("profile.notFound")}</div>;

  const displayName = profile.full_name || "Vinzu member";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-card border border-border p-6 flex flex-col sm:flex-row items-center gap-5">
        {editing ? (
          <label className="relative w-24 h-24 bg-primary/10 flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0">
            {editForm.avatar_url ? (
              <img src={editForm.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary">{displayName[0]?.toUpperCase()}</span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadAvatar(e.target.files[0])} />
          </label>
        ) : (
          <div className="w-24 h-24 bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary flex-shrink-0 overflow-hidden">
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : displayName[0]?.toUpperCase()}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          {editing ? (
            <Input value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder={t("profile.bioPlaceholder")} className="mb-2" />
          ) : (
            <h1 className="text-2xl font-bold">{displayName}</h1>
          )}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {profile.rating_avg?.toFixed(1) || t("profile.new")} ({profile.rating_count || 0})</span>
            <span>{t("profile.memberSince", { year: new Date(profile.created_date).getFullYear() })}</span>
            {profile.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>}
          </div>
        </div>

        {isOwn && !editing && (
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="w-4 h-4 mr-1" /> {t("profile.editProfile")}
          </Button>
        )}
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-card border border-border p-6 mt-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{t("profile.location")}</Label>
              <Input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
            </div>
            <div>
              <Label>{t("profile.phone")}</Label>
              <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>{t("profile.bio")}</Label>
            <Textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={3} />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveProfile} disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("profile.saving")}</> : t("profile.save")}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>{t("profile.cancel")}</Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mt-8 border-b border-border overflow-x-auto">
        {tabs.map((tb, i) => (
          <button
            key={tb}
            onClick={() => setTab(i)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {tb}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 0 && (
          listings.length === 0 ? <Empty text={t("profile.noActive")} /> :
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
        {tab === 1 && (
          sold.length === 0 ? <Empty text={t("profile.noSold")} /> :
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sold.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
        {tab === 2 && (
          reviews.length === 0 ? <Empty text={t("profile.noReviews")} /> :
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.reviewer_name || t("profile.reviewer")}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                </div>
                {r.text && <p className="text-sm text-muted-foreground mt-2">{r.text}</p>}
              </div>
            ))}
          </div>
        )}
        {tab === 3 && (
          <div className="bg-card border border-border p-5 text-sm text-muted-foreground space-y-2">
            <p>{profile.bio || t("profile.noBio")}</p>
            {profile.phone && <p className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {profile.phone}</p>}
            {profile.location && <p className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

const Empty = ({ text }) => <div className="text-center py-16 text-muted-foreground">{text}</div>;
