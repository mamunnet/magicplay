import React from 'react';
import { Users, Wallet, Clock, ChevronRight } from 'lucide-react';
import { AdminUser } from '../types';

interface AdminCardProps {
  admin: AdminUser;
}

const roleColors = {
  'admin': 'text-purple-500',
  'ss-admin': 'text-blue-500',
  'sub-admin': 'text-green-500',
  'super-agent': 'text-yellow-500',
  'master-agent': 'text-red-500'
};

const roleNames = {
  'admin': 'Admin',
  'ss-admin': 'Senior Sub Admin',
  'sub-admin': 'Sub Admin',
  'super-agent': 'Super Agent',
  'master-agent': 'Master Agent'
};

export const AdminCard: React.FC<AdminCardProps> = ({ admin }) => {
  return (
    <div className="bg-[#1a1f2e] rounded-xl p-6 hover:shadow-xl transition-all border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={admin.avatar}
            alt={admin.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
          />
          <div>
            <h3 className="text-lg font-semibold text-white">{admin.name}</h3>
            <span className={`text-sm ${roleColors[admin.role]}`}>
              {roleNames[admin.role]}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs ${
          admin.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-500/20 text-gray-400'
        }`}>
          {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#151b2e] p-3 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Users size={14} className="mr-1" />
            <span className="text-xs">Total Users</span>
          </div>
          <span className="text-white font-semibold">{admin.totalUsers?.toLocaleString()}</span>
        </div>
        
        <div className="bg-[#151b2e] p-3 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Wallet size={14} className="mr-1" />
            <span className="text-xs">Balance</span>
          </div>
          <span className="text-white font-semibold">
            ৳{admin.balance.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-400">
          <Clock size={14} className="mr-1" />
          <span>Last active: {new Date(admin.lastActive).toLocaleTimeString()}</span>
        </div>
        <button className="flex items-center text-emerald-500 hover:text-emerald-400 transition-colors">
          <span className="mr-1">Details</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};