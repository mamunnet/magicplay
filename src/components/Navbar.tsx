import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Shield } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1f2e] text-gray-300 py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-emerald-500">LC</span>
          <span className="text-xl font-bold text-white">247</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <NavItem icon={<Home size={18} />} text="হোম" to="/" />
          <NavItem icon={<Shield size={18} />} text="এডমিন" to="/agents/admin" />
          <NavItem icon={<Shield size={18} />} text="সিনিয়র সাব-এডমিন" to="/agents/ss-admin" />
          <NavItem icon={<Shield size={18} />} text="সাব-এডমিন" to="/agents/sub-admin" />
          <NavItem icon={<Users size={18} />} text="সুপার" to="/agents/super" />
          <NavItem icon={<Users size={18} />} text="মাস্টার" to="/agents/master" />
        </div>

        <div className="flex items-center space-x-4">
          <button className="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white px-4 py-1.5 rounded-md text-sm">
            হেল্প
          </button>
          <MobileMenuButton isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#1a1f2e] border-t border-gray-800 py-4 px-4 space-y-2 shadow-lg md:hidden">
            <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 py-2">
              <Home size={18} />
              <span>হোম</span>
            </Link>
            <Link to="/agents/admin" className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 py-2">
              <Shield size={18} />
              <span>এডমিন</span>
            </Link>
            <Link to="/agents/ss-admin" className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 py-2">
              <Shield size={18} />
              <span>সিনিয়র সাব-এডমিন</span>
            </Link>
            <Link to="/agents/sub-admin" className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 py-2">
              <Shield size={18} />
              <span>সাব-এডমিন</span>
            </Link>
            <Link to="/agents/super" className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 py-2">
              <Users size={18} />
              <span>সুপার</span>
            </Link>
            <Link to="/agents/master" className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 py-2">
              <Users size={18} />
              <span>মাস্টার</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, to }) => (
  <Link 
    to={to} 
    className="flex items-center space-x-1 hover:text-emerald-500 transition-colors relative px-3 py-2"
  >
    {icon}
    <span className="text-sm">{text}</span>
  </Link>
);

const MobileMenuButton: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => (
  <button onClick={onToggle} className="md:hidden text-gray-300 hover:text-white p-2">
    <div className="w-6 h-4 flex flex-col justify-between">
      <span className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
      <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
      <span className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
    </div>
  </button>
);