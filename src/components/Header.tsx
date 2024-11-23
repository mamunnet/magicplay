import React from 'react';
import { Shield } from 'lucide-react';

export const Header = () => {
  return (
    <div className="relative h-[400px] bg-gradient-to-r from-[#1a1f2e] to-[#2a2f3e] overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111827]" />
      
      <div className="relative container mx-auto h-full flex items-center justify-center flex-col text-center px-4">
        <Shield className="w-16 h-16 text-emerald-500 mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          <span className="text-emerald-500">LC</span>247
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          সর্বোচ্চ নিরাপত্তা
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors">
            লগইন
          </button>
          <button className="border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 px-6 py-2 rounded-lg transition-colors">
            রেজিস্টার
          </button>
        </div>
      </div>
    </div>
  );
};