import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Agent, AgentFormData, AgentStatus, AgentType } from '../types/agent';
import { agentTypes } from '../constants/agents';
import { db } from '../lib/db';
import { MESSENGER_PREFIX, WHATSAPP_PREFIX } from '../constants';
import { toast } from 'react-hot-toast';

interface AgentFormProps {
  type: AgentType;
  onSuccess?: () => void;
  onClose?: () => void;
  editData?: Agent;
}

export const AgentForm: React.FC<AgentFormProps> = ({
  type,
  onSuccess,
  onClose,
  editData
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uplineAgents, setUplineAgents] = useState<Agent[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AgentFormData>();

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        phone: editData.phone,
        upline_id: editData.upline_id || undefined,
        whatsapp: editData.whatsapp?.replace(WHATSAPP_PREFIX, '') || editData.phone || '',
        messenger: editData.messenger?.replace(MESSENGER_PREFIX, '') || ''
      });
    }
  }, [editData, reset]);

  useEffect(() => {
    const loadUplineAgents = async () => {
      if (agentTypes[type].uplineType) {
        const agents = await db.getUplineAgents(agentTypes[type].uplineType!);
        setUplineAgents(agents);
      }
    };

    loadUplineAgents();
  }, [type]);

  const onSubmit = async (data: AgentFormData) => {
    try {
      setIsLoading(true);
      
      const agentData: Omit<Agent, 'id' | 'agentId' | 'role' | 'rating' | 'actions' | 'avatar' | 'successRate'> = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        type,
        status: 'active' as AgentStatus,
        upline_id: data.upline_id || null,
        specialty: '',
        experience: '',
        whatsapp: data.whatsapp ? `${WHATSAPP_PREFIX}${data.whatsapp.trim()}` : `${WHATSAPP_PREFIX}${data.phone.trim()}`,
        messenger: data.messenger ? `${MESSENGER_PREFIX}${data.messenger.trim()}` : '',
        created_at: editData?.created_at || Date.now(),
        updated_at: Date.now()
      };

      if (!agentData.name || !agentData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (editData?.id) {
        await db.updateAgent(editData.id, agentData);
        toast.success('Agent updated successfully');
      } else {
        await db.createAgent(agentData);
        toast.success('Agent created successfully');
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Failed to save agent:', error);
      toast.error('Failed to save agent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1F1D1B] rounded-lg shadow-lg w-full max-w-xl mx-4">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#FFB800]">
              {editData ? 'Edit' : agentTypes[type].addTitle}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name', { required: true })}
                className="w-full px-4 py-2 rounded-lg bg-[#2A2725] border border-gray-700 text-gray-200 focus:outline-none focus:border-[#FFB800] transition-colors"
                placeholder="Enter agent name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">Name is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register('phone', { required: true })}
                className="w-full px-4 py-2 rounded-lg bg-[#2A2725] border border-gray-700 text-gray-200 focus:outline-none focus:border-[#FFB800] transition-colors"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">Phone number is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                {...register('whatsapp')}
                className="w-full px-4 py-2 rounded-lg bg-[#2A2725] border border-gray-700 text-gray-200 focus:outline-none focus:border-[#FFB800] transition-colors"
                placeholder="Enter WhatsApp number (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Messenger Link
              </label>
              <input
                type="text"
                {...register('messenger')}
                className="w-full px-4 py-2 rounded-lg bg-[#2A2725] border border-gray-700 text-gray-200 focus:outline-none focus:border-[#FFB800] transition-colors"
                placeholder="Enter Messenger link (optional)"
              />
            </div>

            {agentTypes[type].uplineType && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Upline Agent <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('upline_id', { required: true })}
                  className="w-full px-4 py-2 rounded-lg bg-[#2A2725] border border-gray-700 text-gray-200 focus:outline-none focus:border-[#FFB800] transition-colors"
                >
                  <option value="">Select upline agent</option>
                  {uplineAgents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.agentId})
                    </option>
                  ))}
                </select>
                {errors.upline_id && (
                  <p className="mt-1 text-sm text-red-500">Upline agent is required</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#FFB800] text-black rounded-lg hover:bg-[#FF8A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editData ? 'Update' : 'Create'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};