import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { useState } from 'react';

const menuItems = [
  {
    path: '/magicplayadmin',
    icon: <Home size={20} />,
    label: 'Dashboard'
  },
  {
    path: '/magicplayadmin/agents/master',
    icon: <Users size={20} />,
    label: 'Admin'
  },
  {
    path: '/magicplayadmin/agents/super',
    icon: <Users size={20} />,
    label: 'Senior Sub Admin'
  },
  {
    path: '/magicplayadmin/agents/admin',
    icon: <Users size={20} />,
    label: 'Sub Admin'
  },
  {
    path: '/magicplayadmin/agents/super-agent',
    icon: <Users size={20} />,
    label: 'Super Agent'
  },
  {
    path: '/magicplayadmin/agents/master-agent',
    icon: <Users size={20} />,
    label: 'Master Agent'
  },
  {
    path: '/magicplayadmin/notices',
    icon: <Bell size={20} />,
    name: 'Notices',
  },
  {
    path: '/magicplayadmin/settings',
    icon: <Settings size={20} />,
    label: 'Settings'
  }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    try {
      signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#1F1D1B] border-r border-gray-700 pt-16 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 bg-[#FFB800] text-black p-1 rounded-full"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/magicplayadmin'}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#FFB800] text-black font-medium'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                  title={isCollapsed ? item.label || item.name : ''}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.label || item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} text-gray-300 hover:text-white w-full px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};