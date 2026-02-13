
import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Amenities } from '../components/Amenities';
import { Connectivity } from '../components/Connectivity';
import { Gallery } from '../components/Gallery';
import { FloorPlans } from '../components/FloorPlans';
import { Developer } from '../components/Developer';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { FloatingContact } from '../components/FloatingContact';
import { AppContent } from '../types';
import { getContent } from '../services/contentService';

export const Home: React.FC = () => {
  const [content, setContent] = useState<AppContent | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      const data = await getContent();
      if (mounted) {
        setContent(data);
      }
    };

    loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  if (!content) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
  </div>;

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      <Navbar />
      <Hero content={content.hero} />
      <About content={content.about} />
      <Amenities content={content.amenities} />
      <FloorPlans />
      <Connectivity content={content.connectivity} />
      <Gallery />
      <Developer content={content.developer} />
      <FAQ content={content.faq} />
      <Footer />
      <FloatingContact />
    </div>
  );
};
