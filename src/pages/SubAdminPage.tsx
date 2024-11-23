import React from 'react';
import { AgentTable } from '../components/AgentTable';
import { mockAgents } from '../data/mockAgents';

export const SubAdminPage = () => {
  return (
    <div className="space-y-6">
      <AgentTable agents={mockAgents.subAdmins} title="সাব-এডমিন লিস্ট" />
    </div>
  );
};