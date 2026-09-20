import { useState } from "react";
import { ProseContainer } from "@/components/ProseContainer";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, LifeBuoy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    const msg = `New contact form submission\n\nName: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`;
    const url = `https://wa.me/40729331789?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast({ title: t("contact.sent"), description: t("contact.sentDesc") });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ProseContainer>
        <h1>{t("contact.title")}</h1>
        <p>{t("contact.intro")}</p>
      </ProseContainer>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-card border border-border p-4">
          <Mail className="w-6 h-6 text-primary mb-2" />
          <p className="font-semibold text-sm">{t("contact.emailSupport")}</p>
          <p className="text-xs text-muted-foreground">support@vinzu.app</p>
        </div>
        <div className="bg-card border border-border p-4">
          <MessageCircle className="w-6 h-6 text-primary mb-2" />
          <p className="font-semibold text-sm">{t("contact.inApp")}</p>
          <p className="text-xs text-muted-foreground">{t("contact.inAppDesc")}</p>
        </div>
        <div className="bg-card border border-border p-4">
          <LifeBuoy className="w-6 h-6 text-primary mb-2" />
          <p className="font-semibold text-sm">{t("contact.helpArticles")}</p>
          <p className="text-xs text-muted-foreground">{t("contact.helpDesc")}</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-8 bg-card border border-border p-6 space-y-4 max-w-xl">
        <h2 className="font-bold text-lg">{t("contact.send")}</h2>
        <div>
          <Label>{t("contact.name")}</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="h-11" />
        </div>
        <div>
          <Label>{t("contact.email")}</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="h-11" />
        </div>
        <div>
          <Label>{t("contact.message")}</Label>
          <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} />
        </div>
        <Button type="submit"><MessageCircle className="w-4 h-4 mr-2" /> {t("contact.sendBtn")}</Button>
      </form>
    </div>
  );
}
