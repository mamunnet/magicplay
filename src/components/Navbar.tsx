import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Shield } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-red-500/20">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            MagicPlay247
          </span>
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
          <button className="relative group px-4 py-1.5">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative px-4 py-1.5 bg-black rounded-lg text-white">
              হেল্প
            </div>
          </button>
          <MobileMenuButton isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/90 border-t border-red-500/20 py-4 px-4 space-y-2 backdrop-blur-md md:hidden">
            <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-red-500 py-2">
              <Home size={18} />
              <span>হোম</span>
            </Link>
            <Link to="/agents/admin" className="flex items-center space-x-2 text-gray-300 hover:text-red-500 py-2">
              <Shield size={18} />
              <span>এডমিন</span>
            </Link>
            <Link to="/agents/ss-admin" className="flex items-center space-x-2 text-gray-300 hover:text-red-500 py-2">
              <Shield size={18} />
              <span>সিনিয়র সাব-এডমিন</span>
            </Link>
            <Link to="/agents/sub-admin" className="flex items-center space-x-2 text-gray-300 hover:text-red-500 py-2">
              <Shield size={18} />
              <span>সাব-এডমিন</span>
            </Link>
            <Link to="/agents/super" className="flex items-center space-x-2 text-gray-300 hover:text-red-500 py-2">
              <Users size={18} />
              <span>সুপার</span>
            </Link>
            <Link to="/agents/master" className="flex items-center space-x-2 text-gray-300 hover:text-red-500 py-2">
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
    className="flex items-center space-x-2 text-gray-300 hover:text-red-500 transition-colors relative px-3 py-2"
  >
    {icon}
    <span className="text-sm">{text}</span>
  </Link>
);

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="md:hidden p-2 text-gray-300 hover:text-red-500 transition-colors"
  >
    {isOpen ? (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ) : (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>
);