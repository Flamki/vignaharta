
import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Gallery: React.FC = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
      title: "Megaplex Avadhura",
      status: "Ready Possession",
      desc: "Experience the completed luxury with ready-to-move-in spacious apartments."
    },
    {
      src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      title: "Megaplex Enclave",
      status: "Newly Launched",
      desc: "The future of living starts here. Book your pre-launch offers today."
    },
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      title: "Megaplex Heights",
      status: "Under Construction",
      desc: "Rising high to meet your dreams. Possession by 2026."
    }
  ];

  return (
    <section id="gallery" className="py-16 md:py-32 bg-black text-white overflow-hidden relative border-t border-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 reveal">
            <div>
                <span className="text-brand-gold font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Portfolio</span>
                <h2 className="text-4xl md:text-7xl font-display mb-4">Our Masterpieces</h2>
            </div>
            <button className="hidden md:flex items-center text-brand-gold font-bold tracking-widest hover:text-white transition-colors mt-4 md:mt-0 text-sm border-b border-brand-gold pb-1 hover:border-white">
                VIEW ALL PROJECTS <ArrowRight size={18} className="ml-2" />
            </button>
        </div>
        
        {/* Expanding Flex Gallery */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-4 h-auto md:h-[600px]">
          {images.map((img, idx) => (
            <div 
                key={idx} 
                className={`
                    relative overflow-hidden rounded-xl cursor-pointer 
                    h-[300px] md:h-full 
                    transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                    flex-none w-full md:w-auto md:flex-1 md:hover:flex-[2.5]
                    group border border-white/10 hover:border-brand-gold/50
                `}
            >
              <img 
                src={img.src} 
                alt={img.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80"></div>
              
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                        {img.status}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display text-white mb-3 whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
                        {img.title}
                    </h3>
                    <p className="text-gray-300 text-sm font-light max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 h-0 group-hover:h-auto overflow-hidden">
                        {img.desc}
                    </p>
                    <div className="h-px w-0 bg-brand-gold group-hover:w-24 transition-all duration-700 mt-6 delay-300"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 md:hidden text-center">
             <button className="inline-flex items-center text-brand-gold font-bold tracking-widest hover:text-white transition-colors text-xs border-b border-brand-gold pb-1">
                VIEW ALL PROJECTS <ArrowRight size={14} className="ml-2" />
            </button>
        </div>
      </div>
    </section>
  );
};
