"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type CarouselEvent = {
  id: string;
  title: string;
  imageUrl: string | null;
  spaceName: string | undefined;
};

export default function HeroCarousel({ events }: { events: CarouselEvent[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [events.length]);

  if (events.length === 0) return null;

  return (
    <div className="hidden lg:block relative group w-full aspect-[4/5]">
      <div className="absolute -inset-4 bg-academic-gold rounded-[2rem] rotate-3 opacity-20 group-hover:rotate-6 transition-transform"></div>
      
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-surface-white/10">
        {events.map((event, index) => (
          <div 
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              alt={event.title}
              src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop"}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 gradient-overlay flex flex-col justify-end h-1/2">
              <div className="bg-innovation-purple text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-3">
                Reciente
              </div>
              <h3 className="text-white font-headline-md text-headline-md mb-2 line-clamp-2">{event.title}</h3>
              <p className="text-white/80 text-body-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">location_on</span> {event.spaceName || "Por definir"}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {events.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {events.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-academic-gold w-6" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
