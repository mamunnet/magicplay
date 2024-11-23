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
      try {
        const config = agentTypes[type];
        if (config.uplineType) {
          const agents = await db.getAgents(config.uplineType);
          setUplineAgents(agents);
        } else {
          setUplineAgents([]);
        }
      } catch (error) {
        console.error('Error loading upline agents:', error);
        toast.error('Error loading upline agents');
      }
    };

    loadUplineAgents();
  }, [type]);

  const onSubmit = async (data: AgentFormData) => {
    try {
      setIsLoading(true);
      const formattedData = {
        ...data,
        type,
        whatsapp: data.whatsapp ? `${WHATSAPP_PREFIX}${data.whatsapp}` : undefined,
        messenger: data.messenger ? `${MESSENGER_PREFIX}${data.messenger}` : undefined,
        status: 'active' as AgentStatus
      };

      if (editData) {
        await db.updateAgent(editData.id, formattedData);
      } else {
        await db.createAgent(formattedData as Agent);
      }

      toast.success(editData ? 'Agent updated successfully' : 'Agent created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast.error('Error saving agent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1F1D1B] rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#FFB800]">
              {editData ? 'Edit Agent' : agentTypes[type].addTitle}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full px-3 py-2 bg-[#2A2826] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFB800]"
                placeholder="Enter agent name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                {...register('phone', { required: 'Phone is required' })}
                className="w-full px-3 py-2 bg-[#2A2826] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFB800]"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                WhatsApp (Optional)
              </label>
              <input
                {...register('whatsapp')}
                className="w-full px-3 py-2 bg-[#2A2826] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFB800]"
                placeholder="Enter WhatsApp number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Messenger (Optional)
              </label>
              <input
                {...register('messenger')}
                className="w-full px-3 py-2 bg-[#2A2826] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFB800]"
                placeholder="Enter Messenger ID"
              />
            </div>

            {agentTypes[type].uplineType && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Upline {agentTypes[agentTypes[type].uplineType!].title}
                </label>
                <select
                  {...register('upline_id', { required: 'Upline is required' })}
                  className="w-full px-3 py-2 bg-[#2A2826] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFB800]"
                >
                  <option value="">Select {agentTypes[agentTypes[type].uplineType!].title}</option>
                  {uplineAgents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                {errors.upline_id && (
                  <p className="mt-1 text-sm text-red-500">{errors.upline_id.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#FFB800] hover:bg-[#FFA500] text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : editData ? 'Update Agent' : 'Create Agent'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};