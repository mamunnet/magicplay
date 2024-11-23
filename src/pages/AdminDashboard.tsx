import React, { useState, useEffect } from 'react';
import { AdminNavbar } from '../components/AdminNavbar';
import { Sidebar } from '../components/Sidebar';
import { 
  Users, 
  Activity, 
  Database, 
  Settings,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Bell
} from 'lucide-react';
import { db } from '../lib/db';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, description, icon: Icon, color }) => (
  <div className="bg-[#1F1D1B] p-6 rounded-xl border border-[#FFB800]/10 hover:border-[#FFB800]/30 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const RecentActivity = ({ activity }) => (
  <div className="bg-[#1F1D1B] p-6 rounded-xl border border-[#FFB800]/10">
    <h2 className="text-xl font-bold text-[#FFB800] mb-4">Recent Activity</h2>
    <div className="space-y-4">
      {activity.map((item, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-[#2A2724] rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
            <div>
              <p className="text-white">{item.message}</p>
              <p className="text-gray-400 text-sm">{item.time}</p>
            </div>
          </div>
          <button className="text-[#FFB800] hover:text-[#FF8A00] transition-colors">View</button>
        </div>
      ))}
    </div>
  </div>
);

const TopAgents = ({ agents }) => (
  <div className="bg-[#1F1D1B] p-6 rounded-xl border border-[#FFB800]/10">
    <h2 className="text-xl font-bold text-[#FFB800] mb-4">Top Performing Agents</h2>
    <div className="space-y-4">
      {agents.map((agent, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-[#2A2724] rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-[#FFB800] to-[#FF8A00] flex items-center justify-center text-white font-bold`}>
              {agent.name[0]}
            </div>
            <div>
              <p className="text-white font-medium">{agent.name}</p>
              <p className="text-gray-400 text-sm">{agent.type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#FFB800] font-medium">{agent.performance}</p>
            <p className="text-gray-400 text-sm">{agent.status}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalNotices: 0,
    systemStatus: 'Healthy'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topAgents, setTopAgents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch agents statistics
        const allAgents = await db.getAgents('all');
        const totalAgents = allAgents.length;
        const activeAgents = allAgents.filter(agent => agent.status === 'active').length;

        // Fetch notices count
        const notices = await db.getNotices();
        const totalNotices = notices.length;

        setStats({
          totalAgents,
          activeAgents,
          totalNotices,
          systemStatus: 'Healthy'
        });

        // Get top performing agents (for now, just show the most recently added ones)
        const topAgentsList = allAgents
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 5)
          .map(agent => ({
            id: agent.id,
            name: agent.name,
            type: agent.type,
            performance: 'Active',
            status: agent.status
          }));
        setTopAgents(topAgentsList);

        // Set recent activity (this could be enhanced with a proper activity tracking system)
        setRecentActivity([
          {
            message: 'New agent registered',
            time: '2 minutes ago',
            color: 'bg-emerald-500'
          },
          {
            message: 'Notice updated',
            time: '5 minutes ago',
            color: 'bg-blue-500'
          },
          {
            message: 'System maintenance completed',
            time: '1 hour ago',
            color: 'bg-yellow-500'
          }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error loading dashboard data');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#111827]">
      <AdminNavbar />
      <Sidebar />
      
      <div className="ml-64 pt-16 p-8">
        <h1 className="text-2xl font-bold text-[#FFB800] mb-8">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Agents"
            value={stats.totalAgents}
            description="Registered agents in system"
            icon={Users}
            color="text-[#FFB800]"
          />
          <StatCard
            title="Active Agents"
            value={stats.activeAgents}
            description="Currently active agents"
            icon={UserCheck}
            color="text-emerald-500"
          />
          <StatCard
            title="Total Notices"
            value={stats.totalNotices}
            description="Published notices"
            icon={Bell}
            color="text-blue-500"
          />
          <StatCard
            title="System Status"
            value={stats.systemStatus}
            description="All systems operational"
            icon={Activity}
            color="text-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopAgents agents={topAgents} />
          <RecentActivity activity={recentActivity} />
        </div>
      </div>
    </div>
  );
};