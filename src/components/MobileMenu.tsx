import React from 'react';
import { Menu, X, Shield, Users, Bell, Settings } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle }) => {
  const [isAdminSubmenuOpen, setIsAdminSubmenuOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <button onClick={onToggle} className="text-gray-300 hover:text-white">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#1a1f2e] border-t border-gray-800 py-4 px-4 space-y-2 shadow-lg">
          {/* Admin Panel Dropdown */}
          <div>
            <button 
              onClick={() => setIsAdminSubmenuOpen(!isAdminSubmenuOpen)}
              className="flex items-center justify-between w-full text-gray-300 hover:text-emerald-500 py-2"
            >
              <div className="flex items-center space-x-2">
                <Shield size={18} />
                <span>এডমিন প্যানেল</span>
              </div>
              <span className={`transform transition-transform ${isAdminSubmenuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isAdminSubmenuOpen && (
              <div className="pl-8 mt-2 space-y-2 border-l border-gray-700">
                <a href="#" className="block text-gray-300 hover:text-emerald-500 py-1">এডমিন</a>
                <a href="#" className="block text-gray-300 hover:text-emerald-500 py-1">সিনিয়র সাব-এডমিন</a>
                <a href="#" className="block text-gray-300 hover:text-emerald-500 py-1">সাব-এডমিন</a>
                <a href="#" className="block text-gray-300 hover:text-emerald-500 py-1">সুপার এজেন্ট</a>
                <a href="#" className="block text-gray-300 hover:text-emerald-500 py-1">মাস্টার এজেন্ট</a>
              </div>
            )}
          </div>

          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 py-2">
            <Users size={18} />
            <span>কম্পানি লিড</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 py-2">
            <Bell size={18} />
            <span>নোটিফিকেশন</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 py-2">
            <Settings size={18} />
            <span>সেটিংস</span>
          </a>
        </div>
      )}
    </div>
  );
};