import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../lib/db';
import { agentTypes, AgentType } from '../pages/AgentManagementPage';
import { Agent, AgentFormData } from '../types/agent';

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
  const [uplineOptions, setUplineOptions] = useState<Agent[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<AgentFormData>({
    defaultValues: editData ? {
      name: editData.name,
      phone: editData.phone,
      uplineId: editData.upline_id
    } : {}
  });

  // Fetch potential upline agents based on hierarchy
  useEffect(() => {
    const fetchUplineOptions = async () => {
      const uplineType = agentTypes[type].uplineType;
      if (!uplineType) return; // No upline needed for admin

      try {
        const options = await db.getUplineAgents(uplineType);
        setUplineOptions(options);
      } catch (error) {
        console.error('Error fetching upline options:', error);
        toast.error('Error loading upline options');
      }
    };

    fetchUplineOptions();
  }, [type]);

  const onSubmit = async (data: AgentFormData) => {
    try {
      setIsLoading(true);
      
      // Prepare agent data
      const agentData: Omit<Agent, 'id'> = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        type: type,
        status: 'active',
        upline_id: data.uplineId || undefined,
        created_at: editData?.created_at || Date.now(),
        updated_at: Date.now()
      };

      // Validate required fields
      if (!agentData.name || !agentData.phone) {
        toast.error('Name and phone are required');
        return;
      }

      // Validate upline selection if required
      if (agentTypes[type].uplineType && !data.uplineId) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1F1D1B] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#FFB800]">
            {editData ? 'Edit' : 'Add'} {agentTypes[type].title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Name
            </label>
            <input
              {...register('name', { required: true })}
              className="w-full bg-[#2D2B2A] border border-gray-700 rounded-lg p-2 text-white"
              placeholder="Enter name"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">Name is required</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Phone
            </label>
            <input
              {...register('phone', { required: true })}
              className="w-full bg-[#2D2B2A] border border-gray-700 rounded-lg p-2 text-white"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">Phone is required</span>
            )}
          </div>

          {agentTypes[type].uplineType && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Select {agentTypes[agentTypes[type].uplineType].title}
              </label>
              <select
                {...register('uplineId', { required: true })}
                className="w-full bg-[#2D2B2A] border border-gray-700 rounded-lg p-2 text-white"
              >
                <option value="">Select upline</option>
                {uplineOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} ({option.phone})
                  </option>
                ))}
              </select>
              {errors.uplineId && (
                <span className="text-red-500 text-sm">
                  Upline {agentTypes[agentTypes[type].uplineType].title} is required
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FFB800] hover:bg-[#FF8A00] text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : (
              `${editData ? 'Update' : 'Add'} ${agentTypes[type].title}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};