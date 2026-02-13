
import React from 'react';
import { HeroSection } from '../types';
import { MapPin, ArrowRight } from 'lucide-react';

interface HeroProps {
  content: HeroSection;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  const projectNameParts = content.projectName.trim().split(/\s+/);
  const firstWord = projectNameParts[0] || '';
  const remainingWords = projectNameParts.slice(1).join(' ');

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-brand-dark flex flex-col">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom"
            style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2596&auto=format&fit=crop")',
            }}
        ></div>
        {/* Complex Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
      </div>

      <div className="relative z-10 flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-24 pb-12 md:pt-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Left Content - Main Title */}
            <div className="lg:col-span-7 xl:col-span-8">
                <div className="inline-flex items-center space-x-2 border border-brand-gold/30 bg-black/30 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-6 md:mb-8 animate-fade-in-up">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-gold animate-pulse"></span>
                    <span className="text-brand-gold text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold">{content.title}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-7xl xl:text-8xl font-display text-white mb-6 leading-[1.1] md:leading-[0.9] tracking-tight drop-shadow-2xl animate-fade-in-up animation-delay-100">
                    {firstWord}
                    {remainingWords && (
                      <>
                        {' '}
                        <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#BF953F] font-light italic">
                          {remainingWords}
                        </span>
                      </>
                    )}
                </h1>

                <div className="flex items-center text-gray-300 mb-8 md:mb-10 animate-fade-in-up animation-delay-200 group cursor-pointer" onClick={() => document.getElementById('connectivity')?.scrollIntoView({behavior:'smooth'})}>
                    <div className="p-2 bg-brand-gold/10 rounded-full mr-3 group-hover:bg-brand-gold group-hover:text-black transition-colors duration-300 flex-shrink-0">
                        <MapPin className="text-brand-gold group-hover:text-black transition-colors" size={16} />
                    </div>
                    <span className="text-xs sm:text-sm md:text-lg tracking-widest uppercase font-light border-b border-gray-600 pb-1 group-hover:border-brand-gold transition-colors">{content.location}</span>
                </div>

                <p className="text-gray-400 max-w-xl text-sm md:text-lg font-light leading-relaxed border-l-2 border-brand-gold pl-4 md:pl-6 animate-fade-in-up animation-delay-300 hidden sm:block">
                    {content.subtitle}
                </p>
                
                <div className="mt-8 md:mt-10 animate-fade-in-up animation-delay-400">
                     <button onClick={() => document.getElementById('overview')?.scrollIntoView({behavior:'smooth'})} className="bg-white text-black hover:bg-brand-gold hover:text-black font-bold py-3 md:py-4 px-8 md:px-10 transition-all duration-300 uppercase tracking-[0.2em] text-[10px] md:text-xs">
                        Discover More
                     </button>
                </div>
            </div>

            {/* Right Content - Cards & CTA */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 md:gap-6 animate-fade-in-up animation-delay-500 mt-4 lg:mt-0">
                 {/* Glass Card 1 */}
                 <div className="bg-black/40 backdrop-blur-xl border-l-4 border-brand-gold p-5 md:p-6 hover:bg-black/60 transition-colors group cursor-default rounded-r-lg">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-[10px] uppercase tracking-widest group-hover:text-brand-gold transition-colors">{content.price1Label}</span>
                        <ArrowRight className="text-brand-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" size={16}/>
                    </div>
                    <div className="text-2xl md:text-4xl font-display text-white">
                        {content.price1Value}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500">All Inclusive*</div>
                 </div>

                 {/* Glass Card 2 - Highlighted */}
                 <div className="bg-gradient-to-br from-brand-gold/10 to-black/60 backdrop-blur-xl border border-brand-gold/30 p-6 md:p-8 relative overflow-hidden group rounded-lg">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-gold/20 rounded-full blur-2xl group-hover:bg-brand-gold/30 transition-colors"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-brand-gold text-[10px] uppercase tracking-widest font-bold border border-brand-gold/50 px-2 py-1 rounded">{content.price2Label}</span>
                        </div>
                        <div className="text-2xl md:text-4xl font-display text-white mb-2">
                            {content.price2Value}
                        </div>
                        <p className="text-gray-400 text-xs mb-6">Premium River View Residences</p>
                        
                        <button onClick={() => document.getElementById('floorplans')?.scrollIntoView({behavior:'smooth'})} className="w-full py-3 bg-brand-gold/90 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center rounded">
                            View Floor Plan <ArrowRight size={14} className="ml-2" />
                        </button>
                    </div>
                 </div>
            </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-8 hidden md:flex flex-col items-center gap-2 opacity-50 animate-bounce">
            <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400 rotate-180" style={{writingMode: 'vertical-rl'}}>Scroll Down</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-brand-gold"></div>
        </div>

      </div>
    </div>
  );
};
