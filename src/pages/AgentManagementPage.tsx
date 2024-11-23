import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../lib/db';
import { AdminNavbar } from '../components/AdminNavbar';
import { Sidebar } from '../components/Sidebar';
import { AgentTable } from '../components/AgentTable';
import { AgentForm } from '../components/AgentForm';
import { ViewAgentModal } from '../components/ViewAgentModal';
import { Agent, AgentType } from '../types/agent';
import { agentTypes } from '../constants/agents';

export const AgentManagementPage = () => {
  const { type = 'admin' } = useParams<{ type?: AgentType }>();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Agent | undefined>(undefined);
  const [viewData, setViewData] = useState<Agent | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Map old URLs to new agent types
  const getAgentType = (urlType: string): AgentType => {
    const typeMap: Record<string, AgentType> = {
      'super-agent': 'super-agent',
      'master-agent': 'master-agent',
      'super': 'super',
      'master': 'master',
      'admin': 'admin'
    };
    return typeMap[urlType] || 'admin';
  };

  const currentAgentType = agentTypes[getAgentType(type)];

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const agentList = await db.getAgents(getAgentType(type));
      setAgents(agentList as Agent[]);
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

  const handleDelete = async (agent: Agent) => {
    if (window.confirm(`Are you sure you want to delete ${agent.name}?`)) {
      try {
        await db.deleteAgent(agent.id);
        toast.success('Agent deleted successfully');
        fetchAgents();
      } catch (error) {
        console.error('Error deleting agent:', error);
        toast.error('Failed to delete agent');
      }
    }
  };

  const handleFormSuccess = async () => {
    try {
      await fetchAgents(); // Refresh the list after edit/create
      setShowForm(false);
      setEditData(undefined);
      toast.success(editData ? 'Agent updated successfully' : 'Agent created successfully');
    } catch (error: any) {
      console.error('Error refreshing agents:', error);
      toast.error(error.message || 'Failed to refresh agent list');
    }
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      <AdminNavbar />
      <Sidebar />
      
      <div className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-100">
              {currentAgentType.title}
            </h1>
            <button
              onClick={() => {
                setEditData(undefined); // Clear any existing edit data
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors"
            >
              <Plus size={20} />
              {currentAgentType.addTitle}
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <AgentTable
              agents={agents}
              onDelete={handleDelete}
              onEdit={(agent) => {
                setEditData(agent);
                setShowForm(true);
              }}
              onView={(agent) => setViewData(agent)}
            />
          )}
        </div>
      </div>

      {showForm && (
        <AgentForm
          type={getAgentType(type)}
          onSuccess={handleFormSuccess}
          onClose={() => {
            setShowForm(false);
            setEditData(undefined);
          }}
          editData={editData}
        />
      )}

      {viewData && (
        <ViewAgentModal
          agent={viewData}
          onClose={() => setViewData(undefined)}
        />
      )}
    </div>
  );
};