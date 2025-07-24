import React from 'react'
import ExamTipsCard from './ExamTipsCard/ExamTipsCard';
import Announcements from './Announcements/Announcements';
import WhatsDue from './WhatsDue/WhatsDue';

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <ExamTipsCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Announcements />
        </div>
        <div>
          <WhatsDue />
        </div>
      </div>
    </div>
  );
};

export default Dashboard