"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasFetchedNotifications, setHasFetchedNotifications] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setShowNotifications(false);
  }

  // Form search submission handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/events");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const toggleNotifications = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    
    if (newState && !hasFetchedNotifications) {
      try {
        const res = await fetch("/api/users/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
      setHasFetchedNotifications(true);
    }
  };

  const unreadCount = notifications.length; // For simplicity, we just show total count or a red dot if there are any notifications, but wait, we only fetch when clicked. 
  // Let's actually fetch on mount so we can show a badge.
  
  useEffect(() => {
    fetch("/api/users/notifications")
      .then(res => res.json())
      .then(data => {
        if (data.notifications) {
          setNotifications(data.notifications);
        }
        setHasFetchedNotifications(true);
      })
      .catch(() => {});
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 glass-header shadow-md transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-surface-white tracking-tighter">
            UniEvents
          </Link>
          <nav className="hidden md:flex gap-6 items-center" suppressHydrationWarning>
            <Link 
              href="/events" 
              suppressHydrationWarning
              className={`font-body-md text-label-md transition-colors ${
                pathname === "/" || pathname?.startsWith("/events")
                  ? "text-academic-gold font-bold border-b-2 border-academic-gold pb-1"
                  : "text-surface-variant hover:text-surface-white"
              }`}
            >
              Explorar
            </Link>
            <Link 
              href="/universities" 
              suppressHydrationWarning
              className={`font-body-md text-label-md transition-colors ${
                pathname?.startsWith("/universities")
                  ? "text-academic-gold font-bold border-b-2 border-academic-gold pb-1"
                  : "text-surface-variant hover:text-surface-white"
              }`}
            >
              Universidades
            </Link>
            <Link 
              href="/faculties" 
              suppressHydrationWarning
              className={`font-body-md text-label-md transition-colors ${
                pathname?.startsWith("/faculties")
                  ? "text-academic-gold font-bold border-b-2 border-academic-gold pb-1"
                  : "text-surface-variant hover:text-surface-white"
              }`}
            >
              Facultades
            </Link>
            <Link 
              href="/help/contact" 
              suppressHydrationWarning
              className={`font-body-md text-label-md transition-colors ${
                pathname?.startsWith("/help")
                  ? "text-academic-gold font-bold border-b-2 border-academic-gold pb-1"
                  : "text-surface-variant hover:text-surface-white"
              }`}
            >
              Ayuda
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/20"
          >
            <button 
              type="submit" 
              className="flex items-center justify-center p-0 bg-transparent border-none text-surface-white hover:text-academic-gold transition-colors cursor-pointer mr-2"
              title="Buscar"
            >
              <span className="material-symbols-outlined text-lg">search</span>
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar eventos..."
              className="bg-transparent border-none focus:ring-0 text-white placeholder-white/50 text-label-md w-48 focus:outline-none"
            />
          </form>
          <div className="flex items-center gap-4 text-surface-white relative">
            <button 
              onClick={toggleNotifications}
              className="hidden md:flex hover:bg-primary-container/50 p-2 rounded-full transition-all items-center justify-center relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-full mt-2 right-12 w-80 bg-surface-white rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-50 text-on-surface">
                <div className="p-4 border-b border-outline-variant/30 bg-surface-container-lowest">
                  <h3 className="font-bold text-university-blue text-sm">Notificaciones</h3>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-3xl mb-2 text-outline">notifications_off</span>
                      <p>No tienes notificaciones nuevas.</p>
                    </div>
                  ) : (
                    notifications.map((notif: any) => (
                      <Link href={notif.link} key={notif.id} className="block p-4 border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'warning' ? 'bg-academic-gold' : 'bg-university-blue'}`}></div>
                          <div>
                            <p className="font-bold text-sm text-university-blue mb-1">{notif.title}</p>
                            <p className="text-xs text-on-surface-variant line-clamp-2">{notif.message}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-outline-variant/30 text-center bg-surface-container-lowest">
                  <Link href="/profile" className="text-xs font-bold text-academic-gold hover:underline">Ver mi perfil</Link>
                </div>
              </div>
            )}

            <Link href="/profile" className="hidden md:flex hover:bg-primary-container/50 p-2 rounded-full transition-all items-center justify-center">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
            <button 
              className="md:hidden hover:bg-primary-container/50 p-2 rounded-full transition-all flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-university-blue border-t border-white/10 shadow-lg py-4 px-6 flex flex-col gap-4">
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/20 mb-2"
          >
            <button 
              type="submit" 
              className="flex items-center justify-center p-0 bg-transparent border-none text-surface-white hover:text-academic-gold transition-colors cursor-pointer mr-2"
              title="Buscar"
            >
              <span className="material-symbols-outlined text-lg">search</span>
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar eventos..."
              className="bg-transparent border-none focus:ring-0 text-white placeholder-white/50 text-label-md w-full focus:outline-none"
            />
          </form>
          <Link 
            href="/events" 
            className={`font-body-md text-label-md py-2 transition-colors ${
              pathname === "/" || pathname?.startsWith("/events")
                ? "text-academic-gold font-bold"
                : "text-surface-variant"
            }`}
          >
            Explorar
          </Link>
          <Link 
            href="/universities" 
            className={`font-body-md text-label-md py-2 transition-colors ${
              pathname?.startsWith("/universities")
                ? "text-academic-gold font-bold"
                : "text-surface-variant"
            }`}
          >
            Universidades
          </Link>
          <Link 
            href="/faculties" 
            className={`font-body-md text-label-md py-2 transition-colors ${
              pathname?.startsWith("/faculties")
                ? "text-academic-gold font-bold"
                : "text-surface-variant"
            }`}
          >
            Facultades
          </Link>
          <Link 
            href="/help/contact" 
            className={`font-body-md text-label-md py-2 transition-colors ${
              pathname?.startsWith("/help")
                ? "text-academic-gold font-bold"
                : "text-surface-variant"
            }`}
          >
            Ayuda
          </Link>
          <div className="flex gap-4 pt-2 border-t border-white/10">
            <Link href="/profile" className="flex items-center gap-2 text-surface-white py-2">
              <span className="material-symbols-outlined">account_circle</span>
              <span className="font-body-md">Mi Perfil</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
