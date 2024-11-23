import React from 'react';
import { AgentTable } from '../components/AgentTable';
import { mockAgents } from '../data/mockAgents';

export const MasterAgentPage = () => {
  return (
    <div className="space-y-6">
      <AgentTable agents={mockAgents.masterAgents} title="মাস্টার এজেন্ট লিস্ট" />
    </div>
  );
};