import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Clock, Edit2, Trash2, Search } from 'lucide-react';
import { db } from '../lib/db';
import { NoticeForm } from '../components/NoticeForm';
import { AdminNavbar } from '../components/AdminNavbar';
import { Sidebar } from '../components/Sidebar';
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

export const NoticePage = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Notice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      const noticeList = await db.getNotices();
      setNotices(noticeList);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Error loading notices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (noticeId: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      await db.deleteNotice(noticeId);
      toast.success('Notice deleted successfully');
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditData(notice);
    setShowForm(true);
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && notice.isActive) ||
                         (filter === 'inactive' && !notice.isActive);
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: Notice['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-[#FFB800]';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      <AdminNavbar />
      <Sidebar />
      
      <div className="ml-64 pt-16 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#FFB800]">Notice Management</h1>
          <button
            onClick={() => {
              setEditData(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-[#FFB800] hover:bg-[#FF8A00] text-black font-medium rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Notice</span>
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1F1D1B] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFB800] transition-colors pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="bg-[#1F1D1B] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFB800] transition-colors"
            >
              <option value="all">All Notices</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFB800]"></div>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-[#1F1D1B] rounded-lg border border-gray-700 p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">No notices found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredNotices.map(notice => (
              <div
                key={notice.id}
                className="bg-[#1F1D1B] rounded-lg border border-gray-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{notice.title}</h3>
                    <p className="text-gray-400 whitespace-pre-wrap">{notice.content}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="text-gray-400 hover:text-[#FFB800] transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className={`flex items-center space-x-1 ${getPriorityColor(notice.priority)}`}>
                    <AlertCircle size={16} />
                    <span className="capitalize">{notice.priority} Priority</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock size={16} />
                    <span>{new Date(notice.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    notice.isActive
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {notice.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <NoticeForm
            onClose={() => {
              setShowForm(false);
              setEditData(null);
            }}
            onSuccess={() => {
              fetchNotices();
              setShowForm(false);
              setEditData(null);
            }}
            editData={editData || undefined}
          />
        )}
      </div>
    </div>
  );
};