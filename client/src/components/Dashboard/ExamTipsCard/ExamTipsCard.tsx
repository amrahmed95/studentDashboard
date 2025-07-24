import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import styles from './ExamTipsCard.module.css';
import examTipsImage from '../../../assets/examTips.png';

const ExamTipsCard: React.FC = () => {
  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <Typography variant="h6" component="div" className={styles.title}>
          EXAMS TIME
        </Typography>
        <Typography variant="body1" className={styles.description}>
          Here we are, Are you ready to fight? Don't worry, we prepared some tips to be ready for your exams.
        </Typography>
        <Typography variant="body2" className={styles.quote}>
          "Nothing happens until something moves" - Albert Einstein
        </Typography>
        <Button variant="contained" className={styles.button}>
          View exams tips
        </Button>
      </CardContent>

      <div className={styles.imageContainer}>
        <img
          src={examTipsImage}
          alt="Exam tips illustration"
          className={styles.cardImage}
        />
      </div>

    </Card>
  );
};

export default ExamTipsCard;