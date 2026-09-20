import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, Package, MessageSquare, Plus, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/i18n";
import SearchBar from "@/components/SearchBar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(null);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => { setMobileOpen(false); setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current <= 10) { setVisible(true); lastScroll.current = current; return; }
      if (current > lastScroll.current + 5 && current > 80) setVisible(false);
      else if (current < lastScroll.current - 5) setVisible(true);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout(false);
    navigate("/");
    window.location.reload();
  };

  const avatarUrl = user?.avatar_url;
  const initial = (user?.full_name || user?.email || "U")[0]?.toUpperCase();

  return (
    <header className={`sticky top-0 z-40 bg-primary text-primary-foreground shadow-sm transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 h-16">
          {/* Desktop search */}
          <div className="hidden md:block flex-1 max-w-2xl mx-auto">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Link to="/post-ad" className="hidden sm:block">
              <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                <Plus className="w-4 h-4 mr-1" /> {t("nav.postAd")}
              </Button>
            </Link>

            {/* Profile dropdown */}
            <div className="relative" ref={ref}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-10 h-10 rounded-circle bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors overflow-hidden"
                aria-label={t("nav.account")}
              >
                {isAuthenticated && avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card text-card-foreground border border-border shadow-lg py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold truncate">{user?.full_name || t("nav.account")}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <MenuItem to="/profile" icon={User} label={t("nav.myProfile")} />
                      <MenuItem to="/my-listings" icon={Package} label={t("nav.myListings")} />
                      <MenuItem to="/messages" icon={MessageSquare} label={t("nav.messages")} />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted text-left">
                        <LogOut className="w-4 h-4" /> {t("nav.logOut")}
                      </button>
                    </>
                  ) : (
                    <>
                      <MenuItem to="/login" icon={User} label={t("nav.logIn")} />
                      <MenuItem to="/register" icon={Plus} label={t("nav.signUp")} />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Language switcher */}
            <LanguageSwitcher />

            <button className="md:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label={t("nav.menu")}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search + post ad */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <SearchBar compact />
            <Link to="/post-ad" className="block">
              <Button variant="secondary" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                <Plus className="w-4 h-4 mr-1" /> {t("nav.postAd")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function MenuItem({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted">
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
}
