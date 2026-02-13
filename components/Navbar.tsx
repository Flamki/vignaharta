
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LogoSVG = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#BF953F" />
        <stop offset="25%" stopColor="#FCF6BA" />
        <stop offset="50%" stopColor="#B38728" />
        <stop offset="75%" stopColor="#FBF5B7" />
        <stop offset="100%" stopColor="#AA771C" />
      </linearGradient>
    </defs>
    {/* Geometric Abstract V */}
    <path d="M50 10 L85 80 L50 65 L15 80 Z" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
    <path d="M50 25 L70 70 M50 25 L30 70" stroke="url(#goldGrad)" strokeWidth="1" />
  </svg>
);

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md border-b border-white/5 py-3' 
          : 'bg-gradient-to-b from-black/80 to-transparent py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
            <div className={`mr-3 transition-transform duration-700 group-hover:scale-110`}>
                <LogoSVG />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-[0.15em] text-white leading-none">
                VIGNAHARTA
              </span>
              <span className="text-[8px] uppercase tracking-[0.6em] text-brand-gold text-center mt-1">
                INFINITY
              </span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center bg-black/20 backdrop-blur-sm px-8 py-2 rounded-full border border-white/5">
            <div className="flex space-x-8 xl:space-x-10">
                {['Home', 'Overview', 'Amenities', 'Floor Plans', 'Connectivity', 'Gallery'].map((item) => (
                <button 
                    key={item}
                    onClick={() => handleScroll(item.toLowerCase().replace(' ', ''))} 
                    className="text-[10px] xl:text-[11px] font-medium uppercase tracking-[0.2em] text-gray-300 hover:text-brand-gold transition-colors relative group"
                >
                    {item}
                    <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </button>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/admin" className="text-[9px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
              Login
            </Link>
            <button 
              onClick={() => handleScroll('contact')}
              className="bg-white text-black hover:bg-brand-gold transition-colors px-6 py-2.5 font-bold text-[10px] uppercase tracking-[0.2em]"
            >
              Enquire
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-brand-gold transition-colors">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black z-40 transition-all duration-500 lg:hidden flex flex-col justify-center items-center space-y-8 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute top-0 right-0 p-6">
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white">
                <X size={32} />
            </button>
          </div>
          
          {['Home', 'Overview', 'Amenities', 'Floor Plans', 'Connectivity', 'Gallery', 'Contact'].map((item) => (
          <button 
              key={item}
              onClick={() => handleScroll(item.toLowerCase().replace(' ', ''))} 
              className="text-3xl font-display text-white hover:text-brand-gold transition-colors tracking-widest"
          >
              {item}
          </button>
          ))}
          
          <div className="w-12 h-[1px] bg-white/10 my-6"></div>
          
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 text-xs uppercase tracking-widest hover:text-white">Owner Login</Link>
      </div>
    </nav>
  );
};
