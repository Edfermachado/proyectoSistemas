import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FacultySelector } from '@/components/FacultySelector';
import { FeaturedEvents } from '@/components/FeaturedEvents';
import { TrendingUniversities } from '@/components/TrendingUniversities';
import { AppPromo } from '@/components/AppPromo';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <FacultySelector />
      <FeaturedEvents />
      <TrendingUniversities />
      <AppPromo />
      <Footer />
    </>
  );
}
