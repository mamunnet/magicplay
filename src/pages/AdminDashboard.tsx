import { useState, useEffect } from 'react';
import { AdminNavbar } from '../components/AdminNavbar';
import { Sidebar } from '../components/Sidebar';
import { db } from '../lib/db';
import toast from 'react-hot-toast';
import { Agent, AgentType } from '../types/agent';
import { AgentTable } from '../components/AgentTable';
import { AgentForm } from '../components/AgentForm';
import { ViewAgentModal } from '../components/ViewAgentModal';
import { Plus, Loader2, ChevronDown } from 'lucide-react';
import { agentTypes } from '../constants/agents';

export const AdminDashboard = () => {
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Agent | undefined>(undefined);
  const [viewData, setViewData] = useState<Agent | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [showAgentTypeMenu, setShowAgentTypeMenu] = useState(false);
  const [selectedAgentType, setSelectedAgentType] = useState<AgentType>('admin');

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all types of agents
      const agentTypesList: AgentType[] = ['admin', 'super-agent', 'master-agent', 'super', 'master'];
      const agentPromises = agentTypesList.map(type => db.getAgents(type));
      const agentsResults = await Promise.all(agentPromises);
      
      // Combine all agents into a single array
      const allAgentsCombined = agentsResults.flat().sort((a, b) => {
        // Sort by agent type priority
        const typePriority: Record<AgentType, number> = {
          'admin': 1,
          'super-agent': 2,
          'master-agent': 3,
          'super': 4,
          'master': 5
        };
        
        const priorityA = typePriority[a.type];
        const priorityB = typePriority[b.type];
        
        if (priorityA !== priorityB) return priorityA - priorityB;
        
        // If same level, sort by name
        return a.name.localeCompare(b.name);
      });
      
      setAllAgents(allAgentsCombined);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (agent: Agent) => {
    try {
      await db.deleteAgent(agent.id);
      toast.success('Agent deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Error deleting agent');
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditData(agent);
    setShowForm(true);
  };

  const handleView = (agent: Agent) => {
    setViewData(agent);
  };

  const handleAddAgent = (type: AgentType) => {
    setSelectedAgentType(type);
    setShowAgentTypeMenu(false);
    setShowForm(true);
  };

  return (
    <div className="flex h-screen bg-[#111827]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#111827] p-6">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-[#FFB800] mb-2">All Agents Details</h1>
                  <p className="text-gray-400">Manage and monitor all your agents in one place</p>
                </div>
                <div className="relative ml-4">
                  <button
                    onClick={() => setShowAgentTypeMenu(!showAgentTypeMenu)}
                    className="flex items-center px-4 py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-black font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Agent
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  
                  {showAgentTypeMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#1F1D1B] rounded-lg shadow-xl border border-gray-700 z-50">
                      {Object.entries(agentTypes).map(([type, config]) => (
                        <button
                          key={type}
                          onClick={() => handleAddAgent(type as AgentType)}
                          className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#2A2826] hover:text-[#FFB800] first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                        >
                          {config.addTitle}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 text-[#FFB800] animate-spin" />
                </div>
              ) : allAgents.length === 0 ? (
                <div className="bg-[#1F1D1B] rounded-lg border border-gray-700 p-8 text-center">
                  <p className="text-gray-400 text-lg">No agents found. Add your first agent to get started.</p>
                </div>
              ) : (
                <div className="bg-[#1F1D1B] rounded-lg border border-gray-700 shadow-xl">
                  <AgentTable
                    agents={allAgents}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onView={handleView}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showForm && (
        <AgentForm
          type={selectedAgentType}
          onSuccess={() => {
            setShowForm(false);
            setEditData(undefined);
            fetchDashboardData();
          }}
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