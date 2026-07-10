"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#" className="font-body-md text-label-md text-academic-gold font-bold border-b-2 border-academic-gold pb-1">
              Explore
            </Link>
            <Link href="/universities" className="font-body-md text-label-md text-surface-variant hover:text-academic-gold transition-colors">
              Universities
            </Link>
            <Link href="#" className="font-body-md text-label-md text-surface-variant hover:text-surface-white transition-colors">
              Faculties
            </Link>
            <Link href="#" className="font-body-md text-label-md text-surface-variant hover:text-surface-white transition-colors">
              Help
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/20">
            <span className="material-symbols-outlined text-surface-white text-lg mr-2">search</span>
            <input
              type="text"
              placeholder="Search events..."
              className="bg-transparent border-none focus:ring-0 text-white placeholder-white/50 text-label-md w-48 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4 text-surface-white">
            <button className="material-symbols-outlined hover:bg-primary-container/50 p-2 rounded-full transition-all">
              notifications
            </button>
            <button className="material-symbols-outlined hover:bg-primary-container/50 p-2 rounded-full transition-all">
              account_circle
            </button>
            <button className="bg-academic-gold text-university-blue px-6 py-2 rounded-full font-bold text-label-md hover:scale-105 active:scale-95 duration-150 shadow-lg">
              Create Event
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
