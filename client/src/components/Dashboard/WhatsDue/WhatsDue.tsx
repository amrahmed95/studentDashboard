import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DueItemCard from './DueItemCard';
import styles from './WhatsDue.module.css';

const WhatsDue: React.FC = () => {
  const dueItems = [
    {
      id: 1,
      title: 'Unit 2 quiz',
      course: 'Physics 02',
      topic: 'Unit2: Motion and forces',
      dueDate: '20 Dec 2017 - 09:00 PM',
      isAssignment: false
    },
    {
      id: 2,
      title: '12-12 Assignment',
      course: 'Arabs K12',
      topic: 'Jia21-5/01 May',
      dueDate: '20 Dec 2017 - 09:00 PM',
      isAssignment: true
    }
  ];

  return (
    <Card className={styles.whatsDueCard}>
      <CardContent>
        <Typography variant="h6" component="div" className={styles.title}>
          What's due
        </Typography>

        {dueItems.map((item) => (
          <div key={item.id} className={styles.dueItem}>
            <div className={styles.itemTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {item.isAssignment ? (
                <AssignmentIcon className={styles.icon} />
              ) : (
                <QuizIcon className={styles.icon} />
              )}
              {item.title}
            </div>
            <DueItemCard
              // title={item.title}
              course={item.course}
              topic={item.topic}
              dueDate={item.dueDate}
              isAssignment={item.isAssignment}
            />
          </div>
        ))}

        {dueItems.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No upcoming due items.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsDue;
