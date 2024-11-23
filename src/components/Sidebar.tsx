import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const menuItems = [
  {
    path: '/magicplayadmin',
    icon: <Home size={20} />,
    label: 'Dashboard'
  },
  {
    path: '/magicplayadmin/agents/master',
    icon: <Users size={20} />,
    label: 'Admin Management'
  },
  {
    path: '/magicplayadmin/agents/super',
    icon: <Users size={20} />,
    label: 'Senior Sub Admin Management'
  },
  {
    path: '/magicplayadmin/agents/admin',
    icon: <Users size={20} />,
    label: 'Sub Admin Management'
  },
  {
    path: '/magicplayadmin/agents/super-agent',
    icon: <Users size={20} />,
    label: 'Super Agent Management'
  },
  {
    path: '/magicplayadmin/agents/master-agent',
    icon: <Users size={20} />,
    label: 'Master Agent Management'
  },
  {
    path: '/magicplayadmin/notices',
    icon: <Bell size={20} />,
    label: 'Notices'
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

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#1F1D1B] border-r border-gray-700 pt-16">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/magicplayadmin'}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#FFB800] text-black font-medium'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-300 hover:text-white w-full px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};