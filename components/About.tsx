
import React, { useState } from 'react';
import { AboutSection } from '../types';
import { Download, X, Check } from 'lucide-react';
import { submitLead } from '../services/contentService';

interface AboutProps {
  content: AboutSection;
}

export const About: React.FC<AboutProps> = ({ content }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [submitError, setSubmitError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      
      if (name === 'phone') {
          // Only allow numbers
          const numericValue = value.replace(/\D/g, '');
          setFormData(prev => ({ ...prev, [name]: numericValue }));
          
          if (phoneError) setPhoneError('');
      } else if (name === 'email') {
          setFormData(prev => ({ ...prev, [name]: value }));
          if (emailError) setEmailError('');
      } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict 10-digit validation
    if (!/^\d{10}$/.test(formData.phone)) {
        setPhoneError('Please enter a valid 10-digit mobile number.');
        return;
    }

    if (!emailRegex.test(formData.email.trim())) {
        setEmailError('Please enter a valid email address.');
        return;
    }
    
    setSubmitError('');
    setFormStatus('submitting');

    try {
      await submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        source: 'brochure_download'
      });

      setFormStatus('success');

      const brochureContent = `VIGNAHARTA INFINITY - OFFICIAL BROCHURE\n\n---------------------------------\n\nProject: ${content.title}\n\nDescription:\n${content.description}\n\nHighlights:\n- Prime Avenue Location\n- Expansive Sun Decks\n- Neo-Classical Design\n- 3-Tier Security\n\n---------------------------------\n\nThank you for downloading, ${formData.name}!\nFor more details, visit our sales office.`;
      const blob = new Blob([brochureContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Vignaharta_Infinity_Brochure.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setTimeout(() => {
        setIsModalOpen(false);
        setFormStatus('idle');
        setFormData({ name: '', phone: '', email: '' });
        setPhoneError('');
        setEmailError('');
      }, 3000);
    } catch {
      setFormStatus('idle');
      setSubmitError('Could not submit details right now. Please try again.');
    }
  };

  return (
    <section id="overview" className="py-16 md:py-32 bg-white text-brand-dark overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Editorial Image Composition */}
          <div className="w-full lg:w-1/2 relative group mb-16 lg:mb-0">
             {/* Background Box */}
             <div className="absolute top-6 md:top-10 right-6 md:right-10 w-full h-full bg-[#f5f5f5] -z-10"></div>
             
             <div className="relative z-10">
                <div className="relative overflow-hidden w-full md:w-5/6 shadow-2xl">
                    <img 
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop" 
                    alt="Luxury Interior Living Room" 
                    className="reveal-left w-full h-[300px] md:h-[500px] object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-1000 group-hover:opacity-0"></div>
                </div>

                {/* Overlapping Card */}
                <div className="absolute -bottom-10 right-4 md:-right-4 w-3/4 md:w-2/3 bg-brand-charcoal text-white p-6 md:p-10 shadow-2xl reveal-left delay-200 border border-[#BF953F]/30 z-20">
                     <div className="text-3xl md:text-4xl font-display text-gradient-gold mb-2">30+</div>
                     <div className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/60 mb-4 md:mb-6">Years of Excellence</div>
                     <p className="text-gray-400 text-[10px] md:text-xs font-light leading-relaxed">
                         Delivering landmarks that stand the test of time, defined by quality and elegance.
                     </p>
                </div>
             </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 reveal-right pl-0 lg:pl-10 mt-4 lg:mt-0">
            <div className="flex items-center mb-6 md:mb-10">
                <span className="text-[#BF953F] font-bold uppercase tracking-[0.4em] text-[10px]">The Project</span>
                <div className="h-[1px] w-12 bg-[#BF953F] ml-4"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display text-brand-dark mb-6 md:mb-10 leading-[1.1] md:leading-[0.9]">
              {content.title}
            </h2>
            
            <div className="text-gray-600 mb-8 md:mb-12 whitespace-pre-wrap leading-loose font-light text-base md:text-lg relative pl-6 md:pl-8 border-l border-[#BF953F]/30">
              {content.description}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-8 mb-10 md:mb-16">
                {[
                  "Prime Avenue Location", "Expansive Sun Decks", "Neo-Classical Design", "3-Tier Security"
                ].map((item, idx) => (
                   <div key={idx} className={`flex items-center text-brand-dark font-medium reveal delay-${(idx+1)*100}`}>
                      <div className="w-1.5 h-1.5 bg-[#BF953F] rounded-full mr-4 flex-shrink-0"></div>
                      <span className="uppercase tracking-widest text-xs">{item}</span>
                   </div>
                ))}
            </div>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center bg-black hover:bg-[#BF953F] text-white hover:text-black font-bold py-4 md:py-5 px-12 transition-all duration-500 group border border-black"
            >
              <span className="uppercase tracking-[0.25em] text-xs">Download Brochure</span>
              <Download size={16} className="ml-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>

       {/* Brochure Request Modal */}
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
                        <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em]">Project Details</span>
                        <h3 className="text-2xl font-display text-gray-900 mt-2">Download Brochure</h3>
                        <p className="text-gray-500 text-xs mt-2">Get the complete project details and layout plans.</p>
                    </div>

                    {formStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                                <Check size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">Success!</h4>
                            <p className="text-gray-500 text-sm mb-4">The brochure is downloading...</p>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-brand-gold font-bold uppercase tracking-widest text-xs border-b border-brand-gold pb-1 hover:text-black hover:border-black transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleBrochureSubmit} className="space-y-4">
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
                                        inputMode="numeric"
                                        pattern="\d{10}"
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
                                    {emailError && <p className="text-red-500 text-[10px] mt-1">{emailError}</p>}
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
                                       Download PDF <Download size={14} className="ml-2" />
                                    </>
                                )}
                            </button>
                            
                            <p className="text-[10px] text-gray-400 text-center mt-4 leading-tight">
                                By submitting, you agree to receive project updates.
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
