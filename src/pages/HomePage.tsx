import React from 'react';
import { NoticeDisplay } from '../components/NoticeDisplay';

export const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <NoticeDisplay />
      </div>
    </div>
  );
};