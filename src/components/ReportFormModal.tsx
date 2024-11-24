import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Agent } from '../types/agent';

interface ReportFormModalProps {
  agent: Agent;
  uplineName?: string;
  onClose: () => void;
  onSubmit: (reportData: ReportFormData) => void;
}

export interface ReportFormData {
  agentId: string;
  agentName: string;
  uplineName: string;
  whatsappNumber: string;
  reason: string;
  timestamp: number;
}

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
  agent,
  uplineName = 'N/A',
  onClose,
  onSubmit
}) => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reportData: ReportFormData = {
      agentId: agent.agentId,
      agentName: agent.name,
      uplineName,
      whatsappNumber,
      reason,
      timestamp: Date.now()
    };
    onSubmit(reportData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1F1D1B] rounded-lg p-6 w-full max-w-md relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-[#FFB800] mb-6">Report Agent</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Agent Name</label>
            <input
              type="text"
              value={agent.name}
              disabled
              className="w-full px-3 py-2 bg-[#2A2725] border border-gray-700 rounded-md text-gray-300 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Agent ID</label>
            <input
              type="text"
              value={agent.agentId}
              disabled
              className="w-full px-3 py-2 bg-[#2A2725] border border-gray-700 rounded-md text-gray-300 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Upline Agent</label>
            <input
              type="text"
              value={uplineName}
              disabled
              className="w-full px-3 py-2 bg-[#2A2725] border border-gray-700 rounded-md text-gray-300 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Your WhatsApp Number</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Enter your WhatsApp number"
              required
              className="w-full px-3 py-2 bg-[#2A2725] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#FFB800] transition-colors"
            />
            <p className="text-xs text-gray-400">We will contact you on this WhatsApp number</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Reason for Report</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe your reason for reporting"
              required
              rows={4}
              className="w-full px-3 py-2 bg-[#2A2725] border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:border-[#FFB800] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FFB800] hover:bg-[#FF8A00] text-black font-medium py-2 px-4 rounded-md transition-colors"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};
