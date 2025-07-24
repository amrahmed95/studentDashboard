import React from 'react';
import { Button } from '@mui/material';
import styles from './WhatsDue.module.css';

interface DueItemCardProps {
  title?: string;
  course: string;
  topic: string;
  dueDate: string;
  isAssignment?: boolean;
}

const DueItemCard: React.FC<DueItemCardProps> = ({
  title,
  course,
  topic,
  dueDate,
  isAssignment = false
}) => {
  return (
    <div className={styles.dueItem}>
      <div className={styles.itemTitle}>{title}</div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Course:</span>
        <span className={styles.detailValue}>{course}</span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Topic:</span>
        <span className={styles.detailValue}>{topic}</span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Due to:</span>
        <span className={styles.detailValue}>{dueDate}</span>
      </div>

      <Button
        variant="contained"
        className={styles.button}
        fullWidth
      >
        {isAssignment ? 'Solve Assignment' : 'Start Quiz'}
      </Button>
    </div>
  );
};

export default DueItemCard;