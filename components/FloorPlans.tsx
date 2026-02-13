
import React, { useState } from 'react';
import { X, Check, Download } from 'lucide-react';
import { submitLead } from '../services/contentService';

type PlanType = '1bhk' | '2bhk' | '3bhk';

interface PlanConfig {
    type: PlanType;
    label: string;
    carpetArea: string;
    price: string;
    features: { label: string; value: string }[];
    description: string;
    aspectRatio: string;
}

const PLANS: Record<PlanType, PlanConfig> = {
    '1bhk': {
        type: '1bhk',
        label: 'ROYAL SUITE',
        carpetArea: '450',
        price: '₹ 75.00 Lacs*',
        features: [
            { label: 'Bedrooms', value: '1 Master' },
            { label: 'Bathrooms', value: '2 Premium' },
            { label: 'Decks', value: 'Living + Bed' },
            { label: 'View', value: 'City Horizon' }
        ],
        description: "A perfect blend of cozy luxury and modern efficiency, designed for the rising star. Features a spacious master bedroom and a private deck.",
        aspectRatio: '1/1'
    },
    '2bhk': {
        type: '2bhk',
        label: 'IMPERIAL SUITE',
        carpetArea: '720',
        price: '₹ 1.15 Cr*',
        features: [
            { label: 'Bedrooms', value: '2 Spacious' },
            { label: 'Bathrooms', value: '2 Luxury' },
            { label: 'Decks', value: 'Wrap-around' },
            { label: 'View', value: 'Garden / City' }
        ],
        description: "Expansive living spaces tailored for small families who seek elegance in every corner. Dual decks provide ample natural light.",
        aspectRatio: '450/350'
    },
    '3bhk': {
        type: '3bhk',
        label: 'PRESIDENTIAL SUITE',
        carpetArea: '1050',
        price: '₹ 1.85 Cr*',
        features: [
            { label: 'Bedrooms', value: '3 Grand' },
            { label: 'Bathrooms', value: '3 Spa-style' },
            { label: 'Decks', value: 'Panoramic' },
            { label: 'View', value: 'Sea / Skyline' }
        ],
        description: "The ultimate status symbol. Grandeur living with a dedicated servant quarter and private foyer. Three master suites.",
        aspectRatio: '600/400'
    }
};

export const FloorPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlanType>('1bhk');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [submitError, setSubmitError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [phoneError, setPhoneError] = useState('');

  const currentPlan = PLANS[activeTab];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      
      if (name === 'phone') {
          // Only allow numbers
          const numericValue = value.replace(/\D/g, '');
          setFormData(prev => ({ ...prev, [name]: numericValue }));
          
          if (phoneError) setPhoneError('');
      } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict 10-digit validation
    if (!/^\d{10}$/.test(formData.phone)) {
        setPhoneError('Please enter a valid 10-digit mobile number.');
        return;
    }
    
    setSubmitError('');
    setFormStatus('submitting');

    try {
      await submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        source: 'price_sheet',
        notes: `Plan:${activeTab.toUpperCase()}`
      });

      setFormStatus('success');

      const content = `VIGNAHARTA INFINITY - PRICE SHEET\n\n---------------------------------\n\nPlan Type: ${currentPlan.label}\nConfiguration: ${activeTab.toUpperCase()}\nCarpet Area: ${currentPlan.carpetArea} sq.ft\nStarting Price: ${currentPlan.price}\n\n---------------------------------\n\nThank you for your interest, ${formData.name}!\nOur sales team will contact you shortly at ${formData.phone}.`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Vignaharta_Price_Sheet_${activeTab.toUpperCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setTimeout(() => {
        setIsModalOpen(false);
        setFormStatus('idle');
        setFormData({ name: '', phone: '', email: '' });
        setPhoneError('');
      }, 3000);
    } catch {
      setFormStatus('idle');
      setSubmitError('Could not submit details right now. Please try again.');
    }
  };

  return (
    <section id="floorplans" className="py-16 md:py-32 bg-brand-charcoal relative overflow-hidden text-white">
        {/* Background Texture */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
         
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
          
          {/* Controls Side */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <span className="text-brand-gold font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Residences</span>
            <h2 className="text-4xl md:text-5xl font-display text-white mb-6 md:mb-8">Master Plans</h2>
            <p className="text-gray-400 mb-8 md:mb-10 font-light leading-relaxed text-sm">
                {currentPlan.description}
            </p>
            
            <div className="flex space-x-1 mb-8 md:mb-10 bg-white/5 p-1 border border-white/10 w-full backdrop-blur-sm">
              {(['1bhk', '2bhk', '3bhk'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500 ${
                    activeTab === tab 
                      ? 'bg-brand-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.replace('bhk', ' BHK')}
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-6 md:p-8 relative overflow-hidden group flex-grow flex flex-col justify-between rounded-lg">
               {/* Decorative Gold Line */}
               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#BF953F] to-transparent"></div>
               
               <div>
                    <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                        <div>
                            <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] block mb-2">Configuration</span>
                            <span className="text-xl md:text-2xl font-display text-white text-gradient-gold">{currentPlan.label}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] block mb-2">Carpet Area</span>
                            <span className="text-2xl md:text-3xl font-display text-white">
                            {currentPlan.carpetArea} <span className="text-xs font-sans font-normal text-gray-500">Sq.ft</span>
                            </span>
                        </div>
                    </div>
                    
                    <div className="space-y-6 mb-8">
                        {currentPlan.features.map((feature, idx) => (
                            <div key={idx} className="flex justify-between text-sm group/item border-b border-white/5 pb-2 last:border-0">
                                <span className="text-gray-500 uppercase tracking-wider text-xs">{feature.label}</span>
                                <span className="font-bold text-gray-200 group-hover/item:text-brand-gold transition-colors">{feature.value}</span>
                            </div>
                        ))}
                    </div>
               </div>

              <div>
                  <div className="mb-6">
                      <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] block mb-1">Starting From</span>
                      <span className="text-2xl md:text-3xl font-display text-white">{currentPlan.price}</span>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-bold py-4 transition-all duration-300 uppercase tracking-[0.25em] text-[10px]"
                  >
                    Request Price Sheet
                  </button>
              </div>
            </div>
          </div>

          {/* Image Side - Dynamic Visualization */}
          <div className="w-full lg:w-2/3 min-h-[400px] lg:min-h-auto relative">
             <div className="w-full h-full bg-black border border-white/10 flex items-center justify-center relative overflow-hidden p-4 md:p-8 group rounded-lg">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                {/* Compass */}
                <div className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 border border-white/20 rounded-full flex items-center justify-center z-20">
                    <div className="relative w-full h-full animate-[spin_60s_linear_infinite]">
                         <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] text-brand-gold font-bold">N</span>
                         <div className="absolute top-1/2 left-1/2 w-8 md:w-10 h-[1px] bg-brand-gold -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                         <div className="absolute top-1/2 left-1/2 w-8 md:w-10 h-[1px] bg-brand-gold -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
                    </div>
                </div>

                {/* Simulated Schematic based on Tab */}
                <div className="w-full flex items-center justify-center transition-all duration-1000">
                    {/* Outer Walls - Responsive Container */}
                    <div className="relative border-2 border-white/50 bg-brand-charcoal shadow-[0_0_50px_rgba(0,0,0,0.8)] p-1 transition-all duration-500 w-full mx-auto"
                        style={{
                            maxWidth: activeTab === '1bhk' ? '300px' : activeTab === '2bhk' ? '450px' : '600px',
                            aspectRatio: currentPlan.aspectRatio
                        }}
                    >
                         {/* Internal Rooms - Dynamic Generation using flex/grid */}
                         <div className="w-full h-full grid gap-1 transition-all duration-500"
                            style={{
                                gridTemplateColumns: activeTab === '1bhk' ? '1.5fr 1fr' : activeTab === '2bhk' ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
                                gridTemplateRows: '1fr 1fr'
                            }}
                         >
                            {/* Living Room - Always Present */}
                            <div className="border border-white/20 flex items-center justify-center bg-white/5 hover:bg-brand-gold/10 transition-colors cursor-crosshair col-span-1 row-span-2 relative group/room">
                                <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 group-hover/room:text-brand-gold font-bold transition-colors">Living</span>
                            </div>

                            {/* Master Bed - Always Present */}
                            <div className="border border-white/20 flex items-center justify-center bg-white/5 hover:bg-brand-gold/10 transition-colors cursor-crosshair col-span-1 relative group/room">
                                <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 group-hover/room:text-brand-gold font-bold transition-colors text-center">Master Bed</span>
                            </div>

                             {/* Kitchen - Always Present */}
                            <div className="border border-white/20 flex items-center justify-center bg-white/5 hover:bg-brand-gold/10 transition-colors cursor-crosshair col-span-1 relative group/room">
                                <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 group-hover/room:text-brand-gold font-bold transition-colors">Kitchen</span>
                            </div>

                            {/* 2BHK Extras */}
                            {(activeTab === '2bhk' || activeTab === '3bhk') && (
                                <div className="border border-white/20 flex items-center justify-center bg-white/5 hover:bg-brand-gold/10 transition-colors cursor-crosshair col-span-1 row-span-2 relative group/room animate-fade-in">
                                    <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 group-hover/room:text-brand-gold font-bold transition-colors">Bed 2</span>
                                </div>
                            )}

                             {/* 3BHK Extras */}
                             {(activeTab === '3bhk') && (
                                <div className="border border-white/20 flex items-center justify-center bg-white/5 hover:bg-brand-gold/10 transition-colors cursor-crosshair col-span-1 row-span-2 relative group/room animate-fade-in">
                                    <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 group-hover/room:text-brand-gold font-bold transition-colors">Bed 3</span>
                                </div>
                            )}

                         </div>
                         
                         {/* Balcony Overlay */}
                         <div className="absolute -bottom-4 left-4 right-4 h-4 border-l border-r border-b border-white/30 bg-white/5 flex items-center justify-center">
                            <span className="text-[6px] md:text-[8px] text-brand-gold uppercase tracking-widest">Deck</span>
                         </div>
                    </div>
                </div>
                
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white/30 text-[8px] md:text-[10px] font-mono tracking-widest">
                    SCALE: 1:100 <br/>
                    REF: MP-{activeTab.toUpperCase()}-001 <br/>
                    STATUS: APPROVED
                </div>
             </div>
          </div>

        </div>
      </div>

       {/* Modal Implementation */}
       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl animate-fade-in-up overflow-hidden">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors z-10"
                >
                    <X size={24} />
                </button>
                
                <div className="p-8">
                    <div className="text-center mb-6">
                        <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em]">Exclusive Offer</span>
                        <h3 className="text-2xl font-display text-gray-900 mt-2">Request Price Sheet</h3>
                        <p className="text-gray-500 text-xs mt-2">Get the detailed breakdown for {currentPlan.label}</p>
                    </div>

                    {formStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                                <Check size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Request Sent!</h4>
                            <p className="text-gray-500 text-sm mb-4">The price sheet is downloading...</p>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-brand-gold font-bold uppercase tracking-widest text-xs border-b border-brand-gold pb-1 hover:text-black hover:border-black transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleRequestSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Full Name</label>
                                <input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required 
                                    type="text" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-brand-gold focus:bg-white outline-none transition-colors text-gray-900" 
                                    placeholder="John Doe" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">+91</span>
                                    <input 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required 
                                        type="tel" 
                                        maxLength={10}
                                        className={`w-full bg-gray-50 border rounded p-3 pl-12 text-sm focus:bg-white outline-none transition-colors text-gray-900 ${phoneError ? 'border-red-500' : 'border-gray-200 focus:border-brand-gold'}`} 
                                        placeholder="9876543210" 
                                    />
                                </div>
                                {phoneError && <p className="text-red-500 text-[10px] mt-1">{phoneError}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Email Address</label>
                                <input 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required 
                                    type="email" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-brand-gold focus:bg-white outline-none transition-colors text-gray-900" 
                                    placeholder="john@example.com" 
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={formStatus === 'submitting'}
                                className="w-full bg-black text-white hover:bg-brand-gold hover:text-black font-bold py-4 mt-2 transition-all duration-300 uppercase tracking-[0.2em] text-xs disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {formStatus === 'submitting' ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                       Download Now <Download size={14} className="ml-2" />
                                    </>
                                )}
                            </button>
                            
                            <p className="text-[10px] text-gray-400 text-center mt-4 leading-tight">
                                By submitting, you agree to our privacy policy. Your data is secure with us.
                            </p>
                            {submitError && <p className="text-red-500 text-xs text-center">{submitError}</p>}
                        </form>
                    )}
                </div>
                {/* Decorative bottom strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#BF953F]"></div>
            </div>
         </div>
       )}
    </section>
  );
};
