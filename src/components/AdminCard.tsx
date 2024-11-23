import React from 'react';
import { Users, Wallet, Clock, ChevronRight } from 'lucide-react';
import { AdminUser } from '../types';

interface AdminCardProps {
  admin: AdminUser & {
    totalUsers?: number;
    balance?: string;
  };
}

const roleColors = {
  'admin': 'text-purple-500',
  'ss-admin': 'text-blue-500',
  'sub-admin': 'text-green-500',
  'super-agent': 'text-yellow-500',
  'master-agent': 'text-red-500'
} as const;

const roleNames = {
  'admin': 'Admin',
  'ss-admin': 'Senior Sub Admin',
  'sub-admin': 'Sub Admin',
  'super-agent': 'Super Agent',
  'master-agent': 'Master Agent'
} as const;

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

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#151b2e] p-3 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">Total Users</span>
          </div>
          <div className="text-white font-medium">{admin.totalUsers || 0}</div>
        </div>
        <div className="bg-[#151b2e] p-3 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Wallet className="w-4 h-4 mr-2" />
            <span className="text-sm">Balance</span>
          </div>
          <div className="text-white font-medium">₹{admin.balance || '0'}</div>
        </div>
        <div className="bg-[#151b2e] p-3 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Last Active</span>
          </div>
          <div className="text-white font-medium">{admin.lastActive}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-400 hover:text-white transition-colors cursor-pointer">
        <span>View Details</span>
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};