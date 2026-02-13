
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Township: React.FC = () => {
  const projects = [
    { name: "Vignaharta Aaradhya", status: "Completed", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop" },
    { name: "Vignaharta Enclave", status: "Newly Launched", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=1974&auto=format&fit=crop" },
    { name: "Vignaharta Heights", status: "Under Construction", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop" },
  ];

  return (
    <section className="py-24 bg-[#d1fae5]">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display text-center text-gray-800 mb-12">
                Explore More Buildings in the Township
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden shadow-xl cursor-pointer h-96">
                        <img 
                            src={project.image} 
                            alt={project.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        {/* Navigation Arrows Mockup */}
                        <div className="absolute top-1/2 left-2 -translate-y-1/2 text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeft size={32} />
                        </div>
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={32} />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-300 to-green-400 p-4 text-center transform translate-y-1 group-hover:translate-y-0 transition-transform">
                            <span className="text-xs font-bold uppercase text-green-900 tracking-widest">{project.status} - {project.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};
