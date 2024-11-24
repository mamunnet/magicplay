import React from 'react';
import { Agent } from '../types/agent';

interface QuickAgentTableProps {
  agents: Agent[];
}

export const QuickAgentTable: React.FC<QuickAgentTableProps> = ({ agents }) => {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-yellow-500', 'bg-orange-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-black/40 text-gray-300 uppercase text-xs">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Social Links</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.agentId} className="border-b border-red-500/10 hover:bg-black/40 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${getRandomColor()} flex items-center justify-center text-black font-medium`}>
                    {getInitial(agent.name)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-200">{agent.name}</div>
                    <div className="text-sm text-gray-400">{agent.role}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-300">{agent.agentId}</td>
              <td className="py-3 px-4">
                <div className="flex space-x-3">
                  <a
                    href={`https://wa.me/${agent.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-sm"
                  >
                    WhatsApp
                  </a>
                  {agent.messenger && (
                    <a
                      href={agent.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm"
                    >
                      Messenger
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
