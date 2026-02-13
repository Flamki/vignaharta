
import React, { useState } from 'react';
import { DeveloperSection, ConstructionUpdateItem } from '../types';
import { X } from 'lucide-react';

interface DeveloperProps {
  content: DeveloperSection;
}

export const Developer: React.FC<DeveloperProps> = ({ content }) => {
  const [selectedUpdate, setSelectedUpdate] = useState<ConstructionUpdateItem | null>(null);

  return (
    <section className="bg-white text-brand-dark pb-20 relative">
      
      {/* Title Section */}
      <div className="text-center pt-16 md:pt-24 pb-12 md:pb-16">
         <h2 className="text-4xl md:text-5xl font-display text-brand-dark mb-4 md:mb-6">About Developer</h2>
         <p className="max-w-4xl mx-auto text-gray-500 px-6 text-center leading-relaxed text-base md:text-lg font-light">
            {content.description}
         </p>
      </div>

      {/* Stats Strip - Improved Flex Layout */}
      <div className="bg-[#bbf7d0] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center divide-y md:divide-y-0 md:divide-x divide-green-400/30">
                {content.stats.map((stat, idx) => (
                    <div key={idx} className="w-1/2 md:w-1/4 p-6 flex flex-col items-center justify-center">
                        <span className="text-3xl md:text-5xl font-bold text-green-900 mb-2 font-display">{stat.value}</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-green-800 font-semibold text-center">{stat.label}</span>
                    </div>
                ))}
            </div>
          </div>
      </div>

      {/* Parallax Image Background - Mobile Safe */}
      <div className="h-[300px] md:h-[500px] w-full bg-scroll md:bg-fixed bg-cover bg-center relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')"}}>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Construction Updates Section - Overlapping Card Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 md:-mt-32 relative z-10 pb-12">
           <div className="text-center mb-8 md:mb-12">
             <div className="inline-block border-b-2 border-brand-gold pb-4 px-6 md:px-8 backdrop-blur-sm rounded-lg bg-black/20">
                <h3 className="text-2xl md:text-3xl font-display text-white drop-shadow-lg tracking-wide">Construction Updates</h3>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {content.updates && content.updates.map((update, idx) => (
                  <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-2xl transform hover:-translate-y-3 transition-transform duration-500 group">
                    <div className="h-64 md:h-80 overflow-hidden relative">
                        <img 
                          src={update.image} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          alt={update.title} 
                          onError={(e) => {e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'}}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-70"></div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest block mb-2 px-3 py-1 rounded-full inline-block ${update.status === 'Ready' || update.title === 'Completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                {update.title}
                            </span>
                            <h4 className="text-xl md:text-2xl text-white font-display mb-4 md:mb-6">{update.description}</h4>
                            <button 
                                onClick={() => setSelectedUpdate(update)}
                                className="text-[10px] font-bold text-white border border-white/50 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 cursor-pointer"
                            >
                                View Status
                            </button>
                        </div>
                    </div>
                  </div>
              ))}
              {/* Fallback if no updates content */}
              {!content.updates && (
                  <div className="col-span-3 text-center text-gray-500 py-10 italic">No updates available at the moment.</div>
              )}
           </div>
      </div>

      {/* Image Modal */}
      {selectedUpdate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedUpdate(null)}></div>
            <div className="relative bg-white w-full max-w-5xl rounded-lg overflow-hidden shadow-2xl animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]">
                
                <button
                    onClick={() => setSelectedUpdate(null)}
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="w-full md:w-2/3 bg-black flex items-center justify-center h-[40vh] md:h-auto">
                    <img
                        src={selectedUpdate.image}
                        alt={selectedUpdate.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'}}
                    />
                </div>
                
                <div className="w-full md:w-1/3 p-6 md:p-10 flex flex-col justify-center bg-white border-l border-gray-100 overflow-y-auto">
                    <div className="mb-6 md:mb-8">
                        <span className="text-brand-gold font-bold tracking-[0.25em] text-[10px] uppercase block mb-3">Construction Update</span>
                        <h3 className="text-2xl md:text-4xl font-display text-gray-900 leading-tight mb-2">{selectedUpdate.description}</h3>
                        <span className="text-gray-400 text-sm font-light">{selectedUpdate.title}</span>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Current Status</span>
                            <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-md border border-green-100 text-sm font-bold uppercase tracking-wide">
                                {selectedUpdate.status}
                            </div>
                        </div>
                        
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Remarks</span>
                            <p className="text-gray-600 font-light leading-relaxed text-sm">
                                The construction is proceeding as per the timeline. Quality checks have been completed for this phase.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                             <button onClick={() => setSelectedUpdate(null)} className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-black transition-colors">
                                 Close Details
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

    </section>
  );
};
