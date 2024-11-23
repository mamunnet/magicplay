import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Agent } from '../types/agent';
import { db } from '../lib/db';
import { AgentTable } from './AgentTable';

interface ViewAgentModalProps {
  agent: Agent;
  onClose: () => void;
}

export const ViewAgentModal: React.FC<ViewAgentModalProps> = ({ agent, onClose }) => {
  const [downlineAgents, setDownlineAgents] = useState<Agent[]>([]);
  const [uplineAgent, setUplineAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [downline, upline] = await Promise.all([
          db.getDownlineAgents(agent.id),
          agent.upline_id ? db.getAgentById(agent.upline_id) : null
        ]);
        setDownlineAgents(downline);
        setUplineAgent(upline);
      } catch (error) {
        console.error('Error loading agents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [agent.id, agent.upline_id]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1F1D1B] rounded-lg shadow-lg w-full max-w-6xl mx-4">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#FFB800]">
              {agent.role}: {agent.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#2A2725] p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Agent ID</p>
              <p className="text-[#FFB800] font-medium">{agent.agentId}</p>
            </div>
            <div className="bg-[#2A2725] p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Phone</p>
              <p className="text-gray-200">{agent.phone}</p>
            </div>
            <div className="bg-[#2A2725] p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">WhatsApp</p>
              <a 
                href={`https://wa.me/${agent.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 transition-colors"
              >
                {agent.whatsapp}
              </a>
            </div>
            {agent.messenger && (
              <div className="bg-[#2A2725] p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Messenger</p>
                <a 
                  href={agent.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  {agent.messenger}
                </a>
              </div>
            )}
            <div className="bg-[#2A2725] p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Upline</p>
              <p className="text-[#FFB800]">
                {uplineAgent ? `${uplineAgent.name} (${uplineAgent.role})` : 'No Upline for Admin'}
              </p>
            </div>
            <div className="bg-[#2A2725] p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-gray-200 capitalize">{agent.status}</p>
            </div>
            <div className="bg-[#2A2725] p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Success Rate</p>
              <p className="text-[#FFB800]">{agent.successRate}</p>
            </div>
            <div className="bg-[#2A2725] p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Rating</p>
              <div className="flex items-center">
                <span className="text-[#FFB800]">{agent.rating}</span>
                <span className="text-gray-400">/5</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#FFB800]">Downline Agents</h3>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB800]"></div>
              </div>
            ) : downlineAgents.length > 0 ? (
              <AgentTable
                agents={downlineAgents}
                onEdit={() => {}}
                onDelete={() => {}}
                onView={() => {}}
              />
            ) : (
              <div className="bg-[#2A2725] rounded-lg p-8 text-center">
                <p className="text-gray-400">No downline agents found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
