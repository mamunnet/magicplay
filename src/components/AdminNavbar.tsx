import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const AdminNavbar = () => {
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1F1D1B] text-white h-16 z-50 border-b border-[#FFB800]/10">
      <div className="flex items-center justify-between h-full px-6">
        <Link to="/magicplayadmin" className="flex items-center space-x-2">
          <span className="text-[#FFB800] text-2xl font-bold">Magic</span>
          <span className="text-white text-2xl font-bold">Play</span>
          <span className="text-gray-400 ml-2">Admin</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link 
            to="/magicplayadmin/notices" 
            className="p-2 text-gray-400 hover:text-[#FFB800] transition-colors relative group"
            title="Notices"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="absolute hidden group-hover:block top-full right-0 mt-1 whitespace-nowrap bg-[#2A2826] text-sm py-1 px-2 rounded">
              Notices
            </span>
          </Link>
          
          <Link 
            to="/magicplayadmin/settings" 
            className="p-2 text-gray-400 hover:text-[#FFB800] transition-colors relative group"
            title="Settings"
          >
            <Settings size={20} />
            <span className="absolute hidden group-hover:block top-full right-0 mt-1 whitespace-nowrap bg-[#2A2826] text-sm py-1 px-2 rounded">
              Settings
            </span>
          </Link>

          <div className="relative ml-4">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-[#2A2826] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#FFB800] flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">{user?.email?.split('@')[0]}</div>
                <div className="text-xs text-gray-400">Administrator</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2A2826] rounded-lg shadow-xl border border-gray-700 py-1">
                <Link
                  to="/magicplayadmin/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1F1D1B] hover:text-[#FFB800]"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-[#1F1D1B] hover:text-red-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};