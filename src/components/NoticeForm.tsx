import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { db } from '../lib/db';
import toast from 'react-hot-toast';

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface NoticeFormProps {
  onClose: () => void;
  editData?: Notice;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
}

export const NoticeForm: React.FC<NoticeFormProps> = ({ onClose, editData, onSuccess }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: editData || {
      priority: 'medium',
      isActive: true
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSaving(true);
      
      if (editData?.id) {
        await db.updateNotice(editData.id, data);
        toast.success('Notice updated successfully');
      } else {
        await db.createNotice(data);
        toast.success('Notice added successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error('Failed to save notice. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1F1D1B] rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#FFB800]">
            {editData ? 'Edit' : 'Add'} Notice
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-[#FFB800] transition-colors"
            disabled={isSaving}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full bg-[#2A2724] border border-gray-700 rounded-lg p-2 text-white focus:border-[#FFB800] transition-colors"
              placeholder="Enter notice title"
              disabled={isSaving}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Content</label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows={4}
              className="w-full bg-[#2A2724] border border-gray-700 rounded-lg p-2 text-white focus:border-[#FFB800] transition-colors"
              placeholder="Enter notice content"
              disabled={isSaving}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Priority</label>
            <select
              {...register('priority')}
              className="w-full bg-[#2A2724] border border-gray-700 rounded-lg p-2 text-white focus:border-[#FFB800] transition-colors"
              disabled={isSaving}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4 bg-[#2A2724] border border-gray-700 rounded focus:ring-[#FFB800]"
              disabled={isSaving}
            />
            <label className="ml-2 text-gray-300">Active</label>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#FFB800] hover:bg-[#FF8A00] text-black font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : editData ? 'Update Notice' : 'Add Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};