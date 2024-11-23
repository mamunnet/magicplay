import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const AdminNavbar = () => {
  const { signOut } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1F1D1B] text-white h-16 z-50 border-b border-[#FFB800]/10">
      <div className="flex items-center justify-between h-full px-6">
        <Link to="/magicplayadmin" className="flex items-center space-x-2">
          <span className="text-[#FFB800] text-2xl font-bold">Magic</span>
          <span className="text-white text-2xl font-bold">Play</span>
          <span className="text-gray-400 ml-2">Admin</span>
        </Link>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-[#FFB800] transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-[#FFB800] transition-colors">
            <Settings size={20} />
          </button>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-gray-400">Admin</span>
            <button
              onClick={signOut}
              className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded hover:from-red-600 hover:to-red-700 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};