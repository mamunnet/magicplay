import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AgentTable } from '../components/AgentTable';
import { AgentDetailsModal } from '../components/AgentDetailsModal';
import { ReportFormModal } from '../components/ReportFormModal';
import { SearchBar } from '../components/SearchBar';
import { mockAgents } from '../data/mockAgents';
import { reportsDb } from '../lib/reports';
import { Agent } from '../types/agent';
import type { ReportFormData } from '../components/ReportFormModal';

interface AgentTypeData {
  title: string;
  data: Agent[];
}

const agentTypes: Record<string, AgentTypeData> = {
  admin: {
    title: 'এডমিন লিস্ট',
    data: mockAgents.admins as Agent[]
  },
  'ss-admin': {
    title: 'সিনিয়র সাব-এডমিন লিস্ট',
    data: mockAgents.ssAdmins as Agent[]
  },
  'sub-admin': {
    title: 'সাব-এডমিন লিস্ট',
    data: mockAgents.subAdmins as Agent[]
  },
  super: {
    title: 'সুপার এজেন্ট লিস্ট',
    data: mockAgents.superAgents as Agent[]
  },
  master: {
    title: 'মাস্টার এজেন্ট লিস্ট',
    data: mockAgents.masterAgents as Agent[]
  }
};

export const AgentList = () => {
  const { type = 'admin' } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [reportingAgent, setReportingAgent] = useState<Agent | null>(null);

  const currentAgentType = agentTypes[type as keyof typeof agentTypes] || agentTypes.admin;
  const filteredAgents = currentAgentType.data.filter((agent: Agent) => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.includes(searchTerm)
  );

  const findUplineName = (uplineId: string | null): string | undefined => {
    if (!uplineId) return undefined;
    
    // Search in all agent lists
    const allAgents = [
      ...mockAgents.admins,
      ...mockAgents.ssAdmins,
      ...mockAgents.subAdmins,
      ...mockAgents.superAgents,
      ...mockAgents.masterAgents
    ];
    
    const upline = allAgents.find(agent => agent.id === uplineId);
    return upline?.name;
  };

  const handleView = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleReports = (agent: Agent) => {
    setReportingAgent(agent);
  };

  const handleReportSubmit = async (reportData: ReportFormData) => {
    try {
      await reportsDb.addReport(reportData);
      toast.success('Report submitted successfully');
      setReportingAgent(null);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{currentAgentType.title}</h1>
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="সার্চ করুন..."
        />
      </div>
      <AgentTable 
        agents={filteredAgents} 
        title={currentAgentType.title}
        onView={handleView}
      />

      {/* Agent Details Modal */}
      {selectedAgent && (
        <AgentDetailsModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          uplineName={findUplineName(selectedAgent.upline_id)}
        />
      )}

      {/* Report Form Modal */}
      {reportingAgent && (
        <ReportFormModal
          agent={reportingAgent}
          uplineName={findUplineName(reportingAgent.upline_id)}
          onClose={() => setReportingAgent(null)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};