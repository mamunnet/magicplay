import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../lib/db';
import { AdminNavbar } from '../components/AdminNavbar';
import { Sidebar } from '../components/Sidebar';
import { AgentTable } from '../components/AgentTable';
import { AgentForm } from '../components/AgentForm';
import { Agent } from '../types/agent';

// Define agent types and their hierarchy
export type AgentType = 'admin' | 'ss-admin' | 'sub-admin' | 'super' | 'master';

export const agentTypes: Record<AgentType, {
  title: string;
  uplineType: AgentType | null;
  level: number;
}> = {
  'admin': { 
    title: 'Admin',
    uplineType: null, // Admin has no upline
    level: 1
  },
  'ss-admin': { 
    title: 'Senior Sub-Admin',
    uplineType: 'admin', // SS Admin reports to Admin
    level: 2
  },
  'sub-admin': { 
    title: 'Sub-Admin',
    uplineType: 'ss-admin', // Sub Admin reports to SS Admin
    level: 3
  },
  'super': { 
    title: 'Super Agent',
    uplineType: 'sub-admin', // Super Agent reports to Sub Admin
    level: 4
  },
  'master': { 
    title: 'Master Agent',
    uplineType: 'super', // Master Agent reports to Super Agent
    level: 5
  }
};

export const AgentManagementPage = () => {
  const { type = 'admin' } = useParams<{ type?: AgentType }>();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Agent | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const currentAgentType = agentTypes[type as AgentType];

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const agentList = await db.getAgents(type as AgentType);
      setAgents(agentList);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Error loading agents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [type]);

  const handleDelete = async (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await db.deleteAgent(agentId);
        toast.success('Agent deleted successfully');
        fetchAgents();
      } catch (error) {
        console.error('Error deleting agent:', error);
        toast.error('Failed to delete agent');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      <AdminNavbar />
      <Sidebar />
      
      <div className="ml-64 pt-16 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#FFB800]">
            {currentAgentType.title} Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#FFB800] hover:bg-[#FF8A00] text-black font-medium rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add {currentAgentType.title}</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFB800]"></div>
          </div>
        ) : (
          <div className="bg-[#1F1D1B] rounded-lg border border-gray-700">
            <AgentTable
              agents={agents}
              onDelete={handleDelete}
              onEdit={(agent) => {
                setEditData(agent);
                setShowForm(true);
              }}
            />
          </div>
        )}

        {showForm && (
          <AgentForm
            type={type as AgentType}
            onClose={() => {
              setShowForm(false);
              setEditData(undefined);
            }}
            onSuccess={() => {
              fetchAgents();
              setShowForm(false);
              setEditData(undefined);
            }}
            editData={editData}
          />
        )}
      </div>
    </div>
  );
};