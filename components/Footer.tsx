
import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { submitLead } from '../services/contentService';

const LogoSVG = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 fill-current text-brand-gold">
    <path d="M50 5 L63 35 L95 35 L70 55 L80 90 L50 70 L20 90 L30 55 L5 35 L37 35 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M50 15 L50 45" stroke="currentColor" strokeWidth="1" />
    <path d="M35 45 L35 65 L50 50 L65 65 L65 45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Footer: React.FC = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: value.replace(/\D/g, '') }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!/^\d{10}$/.test(formData.phone)) {
      setSubmitState('error');
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
      setSubmitState('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitState('submitting');
    try {
      await submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        source: 'enquire_now',
        notes: formData.message.trim()
      });
      setSubmitState('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch {
      setSubmitState('error');
      setErrorMessage('Could not submit enquiry. Please try again.');
    }
  };

  return (
    <footer id="contact" className="bg-brand-dark text-white pt-16 md:pt-24 pb-8 md:pb-12 border-t border-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-12 md:mb-20">
          
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center space-x-3">
              <LogoSVG />
              <div className="flex flex-col">
                 <span className="font-display font-bold text-xl tracking-wider leading-none">VIGNAHARTA</span>
                 <span className="text-[9px] uppercase tracking-[0.3em] text-brand-gold">Infinity</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Crafting landmarks that redefine the skyline. Vignaharta Infinity represents the zenith of luxury living, meticulously designed for the elite.
            </p>
            <div className="flex space-x-4">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 border border-gray-800 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                        <Icon size={18}/>
                    </a>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-display mb-6 md:mb-8 text-white">Quick Links</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-gray-500">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Project Overview', id: 'overview' },
                { label: 'Amenities', id: 'amenities' },
                { label: 'Connectivity', id: 'connectivity' },
                { label: 'Gallery', id: 'gallery' }
              ].map((link) => (
                 <li key={link.label}>
                    <a 
                        href={`#${link.id}`} 
                        onClick={(e) => handleScroll(e, link.id)}
                        className="hover:text-brand-gold transition-colors flex items-center group"
                    >
                        <span className="w-0 h-px bg-brand-gold mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                        {link.label}
                    </a>
                 </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-display mb-6 md:mb-8 text-white">Contact Us</h4>
            <ul className="space-y-4 md:space-y-6 text-sm text-gray-500">
                <li className="flex items-start">
                    <MapPin className="text-brand-gold mt-1 mr-4 flex-shrink-0" size={18} />
                    <span>Prime Avenue, Kannamwar Nagar 1, Vikhroli East, Mumbai - 400083.</span>
                </li>
                <li className="flex items-center">
                    <Mail className="text-brand-gold mr-4 flex-shrink-0" size={18} />
                    <span>sales@vignaharta.com</span>
                </li>
                <li className="flex items-center">
                    <Phone className="text-brand-gold mr-4 flex-shrink-0" size={18} />
                    <span>+91 98765 43210</span>
                </li>
            </ul>
          </div>

          <div>
             <h4 className="text-lg font-display mb-6 md:mb-8 text-white">Enquire Now</h4>
             <form className="space-y-4" onSubmit={handleEnquireSubmit}>
                 <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text"
                    required
                    placeholder="Name"
                    className="w-full bg-transparent border-b border-gray-700 py-3 text-sm text-white focus:border-brand-gold outline-none placeholder-gray-600 transition-colors"
                 />
                 <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="text"
                    required
                    inputMode="numeric"
                    pattern="\d{10}"
                    maxLength={10}
                    placeholder="Phone"
                    className="w-full bg-transparent border-b border-gray-700 py-3 text-sm text-white focus:border-brand-gold outline-none placeholder-gray-600 transition-colors"
                 />
                 <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    placeholder="Email (Optional)"
                    className="w-full bg-transparent border-b border-gray-700 py-3 text-sm text-white focus:border-brand-gold outline-none placeholder-gray-600 transition-colors"
                 />
                 <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Write your message"
                    className="w-full bg-transparent border-b border-gray-700 py-3 text-sm text-white focus:border-brand-gold outline-none placeholder-gray-600 transition-colors resize-none"
                 />
                 <button
                    type="submit"
                    disabled={submitState === 'submitting'}
                    className="w-full bg-white text-black font-bold py-4 mt-4 text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors disabled:opacity-70"
                 >
                    {submitState === 'submitting' ? 'Submitting...' : submitState === 'success' ? 'Request Submitted' : 'Request Callback'}
                 </button>
                 {submitState === 'error' && <p className="text-red-400 text-xs">{errorMessage}</p>}
                 {submitState === 'success' && <p className="text-green-400 text-xs">Thanks! Our team will contact you shortly.</p>}
             </form>
          </div>

        </div>
        
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 uppercase tracking-wider text-center md:text-left">
            <p className="mb-4 md:mb-0">&copy; 2024 Vignaharta Group. All rights reserved.</p>
            <div className="space-x-8">
                <a href="#" className="hover:text-brand-gold">Privacy Policy</a>
                <a href="#" className="hover:text-brand-gold">Disclaimer</a>
            </div>
        </div>
      </div>
    </footer>
  );
};
