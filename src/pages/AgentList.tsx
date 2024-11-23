import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AgentTable } from '../components/AgentTable';
import { SearchBar } from '../components/SearchBar';
import { mockAgents } from '../data/mockAgents';

const agentTypes = {
  admin: {
    title: 'এডমিন লিস্ট',
    data: mockAgents.admins
  },
  'ss-admin': {
    title: 'সিনিয়র সাব-এডমিন লিস্ট',
    data: mockAgents.ssAdmins
  },
  'sub-admin': {
    title: 'সাব-এডমিন লিস্ট',
    data: mockAgents.subAdmins
  },
  super: {
    title: 'সুপার এজেন্ট লিস্ট',
    data: mockAgents.superAgents
  },
  master: {
    title: 'মাস্টার এজেন্ট লিস্ট',
    data: mockAgents.masterAgents
  }
};

export const AgentList = () => {
  const { type = 'admin' } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const currentAgentType = agentTypes[type] || agentTypes.admin;
  const filteredAgents = currentAgentType.data.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.includes(searchTerm)
  );

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
      <AgentTable agents={filteredAgents} title={currentAgentType.title} />
    </div>
  );
};