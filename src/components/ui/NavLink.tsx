"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  exact?: boolean;
}

export function NavLink({ href, icon, children, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  
  const isActive = exact 
    ? pathname === href 
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
        isActive 
          ? "text-university-blue bg-primary-fixed shadow-sm border border-primary-fixed-dim font-bold hover:shadow-md" 
          : "text-on-surface-variant hover:text-university-blue hover:bg-surface-container-high font-medium"
      }`}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      {children}
    </Link>
  );
}
