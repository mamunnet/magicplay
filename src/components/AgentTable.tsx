import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface AgentTableProps {
  agents: any[];
  onEdit: (agent: any) => void;
  onDelete: (agentId: string) => void;
}

export const AgentTable: React.FC<AgentTableProps> = ({ agents, onEdit, onDelete }) => {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const getRandomColor = () => {
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-700">
            <th className="py-4 px-4">NAME</th>
            <th className="py-4 px-4">ID</th>
            <th className="py-4 px-4">RATING</th>
            <th className="py-4 px-4">SOCIAL LINK</th>
            <th className="py-4 px-4">PHONE NUMBER</th>
            <th className="py-4 px-4">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.agentId} className="border-b border-gray-700/50">
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${getRandomColor()} rounded-full flex items-center justify-center text-white font-medium`}>
                    {getInitial(agent.name)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{agent.name}</p>
                    <p className="text-sm text-gray-400">{agent.role}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-emerald-500">{agent.agentId}</td>
              <td className="py-4 px-4">
                <div className="flex">
                  {'★'.repeat(agent.rating)}
                  {'☆'.repeat(5 - agent.rating)}
                </div>
              </td>
              <td className="py-4 px-4">
                <a 
                  href={`https://wa.me/${agent.whatsapp}`}
                  className="text-emerald-500 hover:text-emerald-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </td>
              <td className="py-4 px-4 text-gray-300">+{agent.phone}</td>
              <td className="py-4 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(agent)}
                    className="p-1 text-blue-400 hover:text-blue-300"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(agent.agentId)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};