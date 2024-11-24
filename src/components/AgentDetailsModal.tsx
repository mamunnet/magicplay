import React from 'react';
import { X } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { Agent } from '../types/agent';

interface AgentDetailsModalProps {
  agent: Agent | null;
  onClose: () => void;
  uplineName?: string;
}

export const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({ agent, onClose, uplineName }) => {
  if (!agent) return null;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <span className="text-[#FFB800] font-semibold">{rating}</span>
        <span className="text-gray-400 ml-1">/5</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1F1D1B] rounded-lg border border-gray-700 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-[#FFB800]">Agent Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Basic Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#FFB800] flex items-center justify-center text-xl font-bold text-black">
              {agent.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-white">{agent.name}</div>
              <div className="text-sm text-gray-400">{agent.role}</div>
            </div>
          </div>

          {/* Agent ID and Rating */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 p-3 rounded">
              <div className="text-sm text-gray-400">Agent ID</div>
              <div className="text-white font-mono">{agent.agentId}</div>
            </div>
            <div className="bg-black/20 p-3 rounded">
              <div className="text-sm text-gray-400">Rating</div>
              {renderStars(agent.rating)}
            </div>
          </div>

          {/* Upline Info */}
          {uplineName && (
            <div className="bg-black/20 p-3 rounded">
              <div className="text-sm text-gray-400">Upline Agent</div>
              <div className="text-white">{uplineName}</div>
            </div>
          )}

          {/* Social Links */}
          <div className="flex space-x-3">
            {agent.whatsapp && (
              <a
                href={`https://wa.me/${agent.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-400 transition-all"
                title="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
            )}
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
        </div>

        <div className="border-t border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
