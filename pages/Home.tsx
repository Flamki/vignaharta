
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
import { DEFAULT_CONTENT } from '../constants';

export const Home: React.FC = () => {
  const [content, setContent] = useState<AppContent | null>(null);
  const [loadWarning, setLoadWarning] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      try {
        const data = await getContent();
        if (mounted) {
          setContent(data);
          setLoadWarning('');
        }
      } catch {
        if (mounted) {
          setContent(DEFAULT_CONTENT);
          setLoadWarning('Live content is temporarily unavailable. Showing fallback content.');
        }
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
      {loadWarning && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-100 border-b border-amber-200 text-amber-900 text-xs md:text-sm px-4 py-2 text-center">
          {loadWarning}
        </div>
      )}
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
