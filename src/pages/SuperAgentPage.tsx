import React from 'react';
import { AgentTable } from '../components/AgentTable';
import { mockAgents } from '../data/mockAgents';

export const SuperAgentPage = () => {
  return (
    <div className="space-y-6">
      <AgentTable agents={mockAgents.superAgents} title="সুপার এজেন্ট লিস্ট" />
    </div>
  );
};