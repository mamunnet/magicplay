import React from 'react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-[#111827] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 via-transparent to-blue-900/5 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        
        {/* Content */}
        <div className="relative p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-blue-400 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-900/20"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto prose prose-invert max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: content }}
              className="text-gray-300 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-4 [&>p]:mb-2 [&>ul]:mb-6 [&>ul]:pl-4 [&>ul>li]:mb-1 [&>ul>li]:text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
