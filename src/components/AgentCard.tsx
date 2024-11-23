import React from 'react';
import { Agent } from '../types';
import { Star, Phone, Mail, Clock } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
}

const statusColors = {
  'active': 'text-green-500',
  'inactive': 'text-red-500',
  'on-mission': 'text-blue-500'
};

const statusBgColors = {
  'active': 'bg-green-500/20',
  'inactive': 'bg-red-500/20',
  'on-mission': 'bg-blue-500/20'
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="bg-[#1a1f2e] rounded-xl p-6 hover:shadow-xl transition-all border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
          />
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <div className={`px-3 py-1 rounded-full text-xs ${statusBgColors[agent.status]} ${statusColors[agent.status]}`}>
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#151b2e] p-3 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Star className="w-4 h-4 mr-2" />
            <span className="text-sm">Specialty</span>
          </div>
          <div className="text-white font-medium">{agent.specialty}</div>
        </div>
        <div className="bg-[#151b2e] p-3 rounded-lg">
          <div className="flex items-center text-gray-400 mb-1">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Experience</span>
          </div>
          <div className="text-white font-medium">{agent.experience}</div>
        </div>
      </div>

      <div className="bg-[#151b2e] p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Success Rate</span>
          <span className="text-white font-medium">{agent.successRate}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${agent.successRate}%` }}
          ></div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button className="flex-1 bg-[#151b2e] text-white py-2 rounded-lg hover:bg-[#1f2b47] transition-colors">
          <Phone className="w-4 h-4 inline-block mr-2" />
          Contact
        </button>
        <button className="flex-1 bg-[#151b2e] text-white py-2 rounded-lg hover:bg-[#1f2b47] transition-colors">
          <Mail className="w-4 h-4 inline-block mr-2" />
          Message
        </button>
      </div>
    </div>
  );
};