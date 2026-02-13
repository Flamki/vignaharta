
import React, { useState } from 'react';
import { FAQItem } from '../types';
import { Plus, Minus } from 'lucide-react';

interface FAQProps {
  content: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ content }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#F0FDF4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-display text-center text-gray-900 mb-10 md:mb-16">Frequently Asked Questions</h2>
        
        <div className="space-y-3 md:space-y-4">
          {content.map((item) => (
            <div key={item.id} className="group">
              <button
                onClick={() => toggle(item.id)}
                className={`w-full flex items-center justify-between p-4 md:p-6 text-left font-medium transition-all duration-300 rounded-lg shadow-sm border ${
                  openId === item.id 
                    ? 'bg-[#dcfce7] border-green-300 text-green-900' 
                    : 'bg-[#d1fae5] border-transparent text-gray-700 hover:bg-[#a7f3d0]'
                }`}
              >
                <span className="text-sm md:text-base font-bold tracking-wide pr-4">{item.question}</span>
                <span className={`text-green-700 transform transition-transform duration-300 flex-shrink-0 ${openId === item.id ? 'rotate-180' : ''}`}>
                    {openId === item.id ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openId === item.id ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 md:p-6 bg-white rounded-lg text-gray-600 text-sm leading-relaxed shadow-inner border border-gray-100">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
