import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../lib/db';
import { agentTypes, AgentType } from '../pages/AgentManagementPage';
import { Agent, AgentFormData, AgentStatus } from '../types/agent';

interface AgentFormProps {
  type: AgentType;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Agent;
}

export const AgentForm: React.FC<AgentFormProps> = ({ 
  type, 
  onClose, 
  onSuccess, 
  editData 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uplineAgents, setUplineAgents] = useState<Agent[]>([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AgentFormData>();

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        phone: editData.phone,
        upline_id: editData.upline_id,
        specialty: editData.specialty,
        experience: editData.experience
      });
    }
  }, [editData, reset]);

  useEffect(() => {
    const loadUplineAgents = async () => {
      if (agentTypes[type].uplineType) {
        const agents = await db.getUplineAgents(agentTypes[type].uplineType);
        setUplineAgents(agents);
      }
    };

    loadUplineAgents();
  }, [type]);

  const onSubmit = async (data: AgentFormData) => {
    try {
      setIsLoading(true);
      
      const agentData: Omit<Agent, 'id' | 'agentId' | 'whatsapp' | 'role' | 'rating' | 'actions' | 'avatar' | 'successRate'> = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        type,
        status: 'active' as AgentStatus,
        upline_id: data.upline_id,
        specialty: data.specialty || '',
        experience: data.experience || '',
        created_at: editData?.created_at || Date.now(),
        updated_at: Date.now()
      };

      if (!agentData.name || !agentData.phone) {
        toast.error('Name and phone are required');
        return;
      }

      if (agentTypes[type].uplineType && !data.upline_id) {
        toast.error(`Please select an upline ${agentTypes[agentTypes[type].uplineType].title}`);
        return;
      }

      if (editData?.id) {
        await db.updateAgent(editData.id, agentData);
      } else {
        await db.createAgent(agentData);
      }
      
      toast.success(`${agentTypes[type].title} ${editData ? 'updated' : 'added'} successfully`);
      onSuccess();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast.error('Failed to save agent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {editData ? 'Edit' : 'Add'} {agentTypes[type].title}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name', { required: true })}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">Name is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              {...register('phone', { required: true })}
              type="tel"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">Phone is required</p>
            )}
          </div>

          {agentTypes[type].uplineType && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select {agentTypes[agentTypes[type].uplineType].title}
              </label>
              <select
                {...register('upline_id')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select...</option>
                {uplineAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Specialty</label>
            <input
              {...register('specialty')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter specialty"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience</label>
            <input
              {...register('experience')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter experience"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};