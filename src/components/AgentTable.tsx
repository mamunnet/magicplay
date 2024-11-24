import React from 'react';
import { Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Agent } from '../types/agent';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface AgentTableProps {
  agents: Agent[];
  title?: string;
  onEdit?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
  onView: (agent: Agent) => void;
  onReports?: (agent: Agent) => void;
}

export const AgentTable: React.FC<AgentTableProps> = ({ 
  agents, 
  title, 
  onEdit, 
  onDelete, 
  onView,
  onReports 
}) => {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const getRandomColor = () => {
    const colors = ['bg-[#FFB800]', 'bg-[#FF8A00]', 'bg-[#FFA500]'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar 
          key={`full-${i}`} 
          className="text-[#FFB800]"
          size={16}
        />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt 
          key="half" 
          className="text-[#FFB800]"
          size={16}
        />
      );
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar 
          key={`empty-${i}`} 
          className="text-gray-500"
          size={16}
        />
      );
    }

    return stars;
  };

  return (
    <div className="bg-[#1F1D1B] rounded-lg border border-gray-700 overflow-hidden">
      {title && <h2 className="text-xl font-semibold p-4 text-[#FFB800] border-b border-gray-700">{title}</h2>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1A1816] text-[#FFB800] uppercase text-xs">
            <tr>
              <th className="py-4 px-4 text-left">Name</th>
              <th className="py-4 px-4 text-left">ID</th>
              <th className="py-4 px-4 text-left">Rating</th>
              <th className="py-4 px-4 text-left">Social Link</th>
              <th className="py-4 px-4 text-left">Phone Number</th>
              <th className="py-4 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.agentId} className="border-b border-gray-700/50 hover:bg-[#2A2725] transition-colors">
                <td className="py-4 px-4">
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
                <td className="py-4 px-4 text-gray-300">{agent.agentId}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1 group">
                    <div className="flex">
                      {renderStars(agent.rating)}
                    </div>
                    <span className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      ({agent.rating})
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-3">
                    <a
                      href={`https://wa.me/${agent.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-400 transition-all"
                      title="WhatsApp"
                    >
                      <FaWhatsapp size={20} />
                    </a>
                    {agent.messenger && (
                      <a
                        href={agent.messenger}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                        title="Messenger"
                      >
                        <FaFacebookMessenger size={20} />
                      </a>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-300">{agent.phone}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onView(agent)}
                      className="text-[#FFB800] hover:text-[#FF8A00] transition-colors"
                      title="View Agent Details"
                    >
                      <Eye size={18} />
                    </button>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(agent)}
                        className="text-[#FFB800] hover:text-[#FF8A00] transition-colors"
                        title="Edit Agent"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(agent)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                        title="Delete Agent"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {onReports && (
                      <button
                        onClick={() => onReports(agent)}
                        className="text-[#FFB800] hover:text-[#FF8A00] transition-colors"
                        title="Report Agent"
                      >
                        <FileText size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};