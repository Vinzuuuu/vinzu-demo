import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, ArrowLeft } from "lucide-react";
import { timeAgo } from "@/lib/format";

export default function Messages() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get("c");
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadConversations = () => {
    if (!user) return;
    base44.entities.Conversation.filter({}, "-last_message_date", 100)
      .then((all) => setConversations(all.filter((c) => c.participant_ids?.includes(user.id))))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadConversations, [user]);

  useEffect(() => {
    if (!activeId) { setActive(null); setMessages([]); return; }
    base44.entities.Conversation.get(activeId).then(setActive).catch(() => setActive(null));
    base44.entities.Message.filter({ conversation_id: activeId }, "created_date", 200)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
  }, [activeId]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    setSending(true);
    const msgText = text.trim();
    setText("");
    try {
      await base44.entities.Message.create({
        conversation_id: active.id,
        sender_id: user.id,
        sender_name: user.full_name || "You",
        text: msgText,
        read: false,
      });
      await base44.entities.Conversation.update(active.id, {
        last_message: msgText,
        last_message_date: new Date().toISOString(),
      });
      setMessages((prev) => [...prev, { id: "tmp", sender_id: user.id, text: msgText, created_date: new Date().toISOString() }]);
      loadConversations();
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      setText(msgText);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-muted-foreground">{t("messages.loading")}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{t("messages.title")}</h1>
      <div className="grid md:grid-cols-3 gap-4 bg-card border border-border overflow-hidden h-[70vh]">
        {/* Conversation list */}
        <div className={`border-r border-border overflow-y-auto ${activeId ? "hidden md:block" : "block"}`}>
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              {t("messages.none")}
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSearchParams({ c: c.id })}
                className={`w-full text-left p-3 border-b border-border hover:bg-muted transition-colors ${activeId === c.id ? "bg-muted" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {(c.listing_title || "C")[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.listing_title || t("messages.conversation")}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.last_message || t("messages.startChatting")}</p>
                  </div>
                  {c.last_message_date && <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(c.last_message_date, lang)}</span>}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat */}
        <div className={`md:col-span-2 flex flex-col ${activeId ? "flex" : "hidden md:flex"}`}>
          {active ? (
            <>
              <div className="p-3 border-b border-border flex items-center gap-2">
                <button onClick={() => setSearchParams({})} className="md:hidden">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{active.listing_title}</p>
                  <Link to={`/listing/${active.listing_id}`} className="text-xs text-primary hover:underline">{t("messages.viewListing")}</Link>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
                {messages.map((m) => {
                  const mine = m.sender_id === user.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={send} className="p-3 border-t border-border flex gap-2">
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={t("messages.type")} className="h-11" />
                <Button type="submit" size="icon" className="h-11 w-11" disabled={sending || !text.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              {t("messages.selectConv")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
