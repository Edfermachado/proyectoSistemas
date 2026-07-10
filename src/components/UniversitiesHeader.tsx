"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function UniversitiesHeader() {
  const pathname = usePathname();

  // Define los colores de tu tema para usarlos aquí
  const activeLinkColor = "text-academic-gold";
  const inactiveLinkColor = "text-surface-variant hover:text-surface-white";

  return (
    <header className="bg-university-blue text-white sticky top-0 z-50 shadow-md" data-purpose="main-navigation">
      <nav className="container mx-auto px-margin-desktop py-4 flex items-center justify-between max-w-container-max">
        {/* Logo and Main Nav */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-white flex items-center">
            Uni<span className="text-academic-gold">Events</span>
          </Link>
          <div className="hidden md:flex space-x-6 text-sm font-medium items-center">
            <Link href="/" className={`${pathname === '/' ? activeLinkColor : inactiveLinkColor} transition-colors`}>Explore</Link>
            <Link href="/universities" className={`${pathname === '/universities' ? `${activeLinkColor} border-b-2 border-academic-gold pb-1` : inactiveLinkColor} transition-colors`}>Universities</Link>
            <Link href="#" className={`${inactiveLinkColor} transition-colors`}>Faculties</Link>
            <Link href="#" className={`${inactiveLinkColor} transition-colors`}>Help</Link>
          </div>
        </div>
        {/* Search and CTA */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">search</span>
            <input className="bg-slate-800 border-none rounded-full py-1.5 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-academic-gold text-white" placeholder="Search events..." type="text" />
          </div>
          <button className="bg-academic-gold hover:opacity-90 text-university-blue font-bold py-2 px-4 rounded-lg text-sm transition-colors">
            Create Event
          </button>
        </div>
      </nav>
    </header>
  );
}