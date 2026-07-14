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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        router.push(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push("/events");
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
          <div className="hidden lg:flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/20">
            <span className="material-symbols-outlined text-surface-white text-lg mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Buscar eventos..."
              className="bg-transparent border-none focus:ring-0 text-white placeholder-white/50 text-label-md w-48 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4 text-surface-white">
            <button className="hidden md:flex hover:bg-primary-container/50 p-2 rounded-full transition-all items-center justify-center">
              <span className="material-symbols-outlined">notifications</span>
            </button>
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
            onSubmit={(e) => { e.preventDefault(); handleSearchKeyDown({ key: 'Enter' } as any); }}
            className="flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/20 mb-2"
          >
            <span className="material-symbols-outlined text-surface-white text-lg mr-2">search</span>
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
