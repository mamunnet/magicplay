import React from 'react';
import { Shield, Target, Award, MessageCircle } from 'lucide-react';
import { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
}

const statusColors = {
  'active': 'bg-emerald-500',
  'inactive': 'bg-gray-500',
  'on-mission': 'bg-yellow-500'
};

const statusText = {
  'active': 'Active',
  'inactive': 'Inactive',
  'on-mission': 'On Mission'
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="bg-[#1a1f2e] rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-800">
      <div className="relative mb-4">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-800"
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className={`px-3 py-1 rounded-full text-xs ${statusColors[agent.status]} text-white`}>
            {statusText[agent.status]}
          </span>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
        <p className="text-emerald-500 font-medium">{agent.role}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-300 bg-[#151b2e] p-2 rounded-lg">
          <Shield className="w-5 h-5 mr-2 text-emerald-500" />
          <span className="text-sm">{agent.specialty}</span>
        </div>
        
        <div className="flex items-center text-gray-300 bg-[#151b2e] p-2 rounded-lg">
          <Target className="w-5 h-5 mr-2 text-emerald-500" />
          <span className="text-sm">{agent.experience} years experience</span>
        </div>

        <div className="flex items-center text-gray-300 bg-[#151b2e] p-2 rounded-lg">
          <Award className="w-5 h-5 mr-2 text-emerald-500" />
          <span className="text-sm">{agent.successRate}% success rate</span>
        </div>
      </div>

      <button className="w-full mt-6 bg-emerald-500 text-white py-2.5 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-600 transition-colors">
        <MessageCircle size={18} />
        <span>Contact Agent</span>
      </button>
    </div>
  );
};