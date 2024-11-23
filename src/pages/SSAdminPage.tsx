import React from 'react';
import { AgentTable } from '../components/AgentTable';
import { mockAgents } from '../data/mockAgents';

export const SSAdminPage = () => {
  return (
    <div className="space-y-6">
      <AgentTable agents={mockAgents.ssAdmins} title="সিনিয়র সাব-এডমিন লিস্ট" />
    </div>
  );
};