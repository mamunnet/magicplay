import React from 'react';
import { AgentTable } from '../components/AgentTable';
import { mockAgents } from '../data/mockAgents';

export const AdminPage = () => {
  return (
    <div className="space-y-6">
      <AgentTable agents={mockAgents.admins} title="এডমিন লিস্ট" />
    </div>
  );
};