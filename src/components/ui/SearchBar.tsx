"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export function SearchBar({ placeholder = "Buscar..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    // Prevent re-triggering if the query state matches the URL param
    const currentQ = searchParams.get("q") || "";
    if (query === currentQ) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, pathname, router, searchParams]);

  return (
    <div className="p-6 border-b border-outline-variant/50 bg-surface-container-lowest flex items-center gap-4">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full md:w-1/3 px-4 py-2 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold text-label-md"
      />
      {isPending && <span className="text-sm text-on-surface-variant animate-pulse">Buscando...</span>}
    </div>
  );
}
