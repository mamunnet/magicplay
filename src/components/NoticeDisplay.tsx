import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { db } from '../lib/db';
import type { Notice } from '../types/notice';

export const NoticeDisplay = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticeList = await db.getNotices();
        setNotices(noticeList.filter(notice => notice.isActive));
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    fetchNotices();
    // Set up real-time updates
    const interval = setInterval(fetchNotices, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: Notice['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-[#FFB800]';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-[#1F1D1B] rounded-lg p-6 border border-[#FFB800]/20">
      <h2 className="text-2xl font-bold text-[#FFB800] mb-6 flex items-center">
        <AlertCircle className="mr-2" size={24} />
        নোটিশ বোর্ড
      </h2>
      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-[#2A2724] p-6 rounded-lg border border-[#FFB800]/10 hover:border-[#FFB800]/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-white">{notice.title}</h3>
              <div className="flex items-center space-x-2">
                <AlertCircle size={16} className={getPriorityColor(notice.priority)} />
                <span className={`text-sm capitalize ${getPriorityColor(notice.priority)}`}>
                  {notice.priority === 'high' ? 'জরুরি' : notice.priority === 'medium' ? 'মাঝারি' : 'সাধারণ'}
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-base leading-relaxed mb-4">{notice.content}</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>প্রকাশিত: {new Date(notice.createdAt).toLocaleDateString('bn-BD')}</span>
              {notice.updatedAt && notice.updatedAt !== notice.createdAt && (
                <span>আপডেট: {new Date(notice.updatedAt).toLocaleDateString('bn-BD')}</span>
              )}
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-400 text-lg">কোন সক্রিয় নোটিশ নেই</p>
          </div>
        )}
      </div>
    </div>
  );
};