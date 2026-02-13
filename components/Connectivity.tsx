
import React from 'react';
import { ConnectivitySection } from '../types';
import { MapPin, Clock } from 'lucide-react';

interface ConnectivityProps {
  content: ConnectivitySection;
}

export const Connectivity: React.FC<ConnectivityProps> = ({ content }) => {
  return (
    <section id="connectivity" className="py-16 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-20 reveal">
          <h2 className="text-4xl md:text-6xl font-display text-brand-dark mb-6">{content.title}</h2>
          <div className="h-px w-20 bg-brand-gold mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-light">{content.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-stretch">
          
          {/* Map Section */}
          <div className="w-full lg:w-3/5 h-[300px] md:h-[500px] reveal-zoom rounded-sm overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 border-2 border-brand-gold/20 z-10 pointer-events-none group-hover:border-brand-gold transition-colors duration-500"></div>
            <iframe 
              src={content.mapUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Project Location"
              className="w-full h-full"
            ></iframe>
          </div>

          {/* List Section */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center">
            <h3 className="text-2xl font-display mb-6 md:mb-10 flex items-center text-brand-dark reveal-right">
              <MapPin className="mr-3 text-brand-gold" /> Key Landmarks
            </h3>
            <div className="space-y-1 md:space-y-2">
              {content.items.map((item, idx) => (
                <div key={item.id} className={`reveal-right delay-${(idx % 4) * 100} flex justify-between items-center py-4 md:py-5 border-b border-gray-100 group cursor-default`}>
                  <span className="font-medium text-gray-800 text-base md:text-lg group-hover:text-brand-gold transition-colors">{item.location}</span>
                  <div className="flex items-center text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-black transition-colors uppercase tracking-widest flex-shrink-0 ml-4">
                    <Clock size={14} className="mr-2" />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 md:mt-12 p-6 md:p-8 bg-brand-dark text-white text-center shadow-2xl reveal-right delay-500 relative overflow-hidden border border-brand-gold/30 rounded-lg">
               <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-4">Site Address</p>
               <p className="font-serif text-lg md:text-xl leading-snug">
                 Prime Avenue, Kannamwar Nagar 1, Vikhroli (East)
               </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
