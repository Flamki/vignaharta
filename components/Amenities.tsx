
import React, { useState } from 'react';
import { AmenitySection } from '../types';
import { DynamicIcon } from './Icons';
import { ArrowUpRight } from 'lucide-react';

interface AmenitiesProps {
  content: AmenitySection;
}

// Mapping IDs from constants.ts to high-quality Unsplash images
const AMENITY_IMAGES: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop', // Gymnasium
  '2': 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop', // Kids Play Area (Updated)
  '3': 'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=2072&auto=format&fit=crop', // Jogging Track
  '4': 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop', // Yoga Deck
  '5': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop', // Swimming Pool
  '6': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop', // Senior Citizen
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2074&auto=format&fit=crop';

export const Amenities: React.FC<AmenitiesProps> = ({ content }) => {
  const [activeId, setActiveId] = useState<string>(content.items[0]?.id || '1');

  // Fallback if no items
  if (!content.items || content.items.length === 0) return null;

  return (
    <section id="amenities" className="relative bg-black text-white overflow-hidden">
      
      {/* --- DESKTOP: Immersive Background Interaction --- */}
      <div className="hidden lg:block relative h-screen min-h-[700px] w-full">
        
        {/* Dynamic Background Layer */}
        <div className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out">
          {content.items.map((item) => (
            <div 
                key={item.id}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${activeId === item.id ? 'opacity-60 scale-105' : 'opacity-0 scale-100'}`}
                style={{ backgroundImage: `url(${AMENITY_IMAGES[item.id] || DEFAULT_IMAGE})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-8 grid grid-cols-12 items-center">
            
            {/* Left Side: Title & Description */}
            <div className="col-span-5 pr-12">
                <span className="text-brand-gold font-bold tracking-[0.3em] text-xs uppercase mb-6 block animate-fade-in-up">
                    Amenities & Lifestyle
                </span>
                <h2 className="text-6xl xl:text-7xl font-display leading-[1.1] mb-8 text-white drop-shadow-lg">
                    {content.title}
                </h2>
                <p className="text-gray-300 font-light text-lg leading-relaxed border-l border-brand-gold/50 pl-6">
                    {content.subtitle}
                </p>
            </div>

            {/* Right Side: Interactive List */}
            <div className="col-span-7 pl-12 flex flex-col justify-center h-full max-h-[80vh]">
                <div className="space-y-2">
                    {content.items.map((item, index) => (
                        <div 
                            key={item.id}
                            onMouseEnter={() => setActiveId(item.id)}
                            className={`group flex items-center justify-between p-6 cursor-pointer border-b border-white/10 transition-all duration-500 hover:bg-white/5 rounded-lg ${activeId === item.id ? 'pl-10 border-brand-gold/50 bg-white/5' : 'pl-4'}`}
                        >
                            <div className="flex items-center gap-6">
                                <span className={`text-xs font-mono transition-colors duration-300 ${activeId === item.id ? 'text-brand-gold' : 'text-gray-600'}`}>
                                    0{index + 1}
                                </span>
                                <h3 className={`text-3xl font-display transition-colors duration-300 ${activeId === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {item.title}
                                </h3>
                            </div>
                            
                            <div className={`flex items-center gap-4 transition-all duration-500 ${activeId === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
                                     <DynamicIcon name={item.icon} className="w-5 h-5" />
                                </div>
                                <ArrowUpRight className="text-brand-gold w-5 h-5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>


      {/* --- MOBILE: Scroll Snap Carousel --- */}
      <div className="lg:hidden py-16 px-4 bg-brand-dark relative">
          <div className="text-center mb-10">
             <span className="text-brand-gold font-bold tracking-[0.3em] text-[10px] uppercase mb-3 block">Lifestyle</span>
             <h2 className="text-4xl font-display text-white mb-4">{content.title}</h2>
             <p className="text-gray-400 text-sm font-light max-w-md mx-auto">{content.subtitle}</p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 hide-scrollbar">
              {content.items.map((item, index) => (
                  <div key={item.id} className="snap-center shrink-0 w-[85vw] sm:w-[350px] relative rounded-2xl overflow-hidden aspect-[4/5] group shadow-2xl border border-white/10">
                      <img 
                        src={AMENITY_IMAGES[item.id] || DEFAULT_IMAGE} 
                        alt={item.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="w-12 h-12 mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-brand-gold">
                                <DynamicIcon name={item.icon} className="w-6 h-6" />
                          </div>
                          <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-1 block">0{index + 1}</span>
                          <h3 className="text-2xl font-display text-white">{item.title}</h3>
                      </div>
                  </div>
              ))}
              {/* Spacer for right padding scroll */}
              <div className="snap-center shrink-0 w-4"></div>
          </div>
      </div>

    </section>
  );
};
