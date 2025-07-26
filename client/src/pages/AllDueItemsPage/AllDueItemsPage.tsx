import React, { useEffect, useState } from 'react';
import { Box, Typography, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DueItemCard from '../../components/Dashboard/WhatsDue/DueItemCard';
import styles from './AllDueItemsPage.module.css';

interface DueItem {
  _id: string;
  title: string;
  course: string;
  topic: string;
  dueDate: string;
  isAssignment: boolean;
  description?: string;
}

const AllDueItemsPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<DueItem[]>([]);
  const [assignments, setAssignments] = useState<DueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        setLoading(true);
        const [quizRes, assignmentRes] = await Promise.all([
          fetch('http://localhost:3000/api/quiz/'),
          fetch('http://localhost:3000/api/assignment')
        ]);

        if (!quizRes.ok || !assignmentRes.ok) {
          throw new Error('Failed to fetch items');
        }

        const quizData = await quizRes.json();
        const assignmentData = await assignmentRes.json();

        const formatDueDate = (dateString: string) => {
          const date = new Date(dateString);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${day} ${month} ${year} - ${hours}:${minutes} ${parseInt(hours) >= 12 ? 'PM' : 'AM'}`;
        };

        // Process and sort quizzes by due date (nearest first)
        const sortedQuizzes = quizData.data
          .map((q: any) => ({
            _id: q._id,
            title: q.title,
            course: q.course,
            topic: q.topic,
            dueDate: formatDueDate(q.dueDate),
            isAssignment: false,
            description: q.description
          }))
          .sort((a: DueItem, b: DueItem) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );

        // Process and sort assignments by due date (nearest first)
        const sortedAssignments = assignmentData.data
          .map((a: any) => ({
            _id: a._id,
            title: a.title,
            course: a.course,
            topic: a.topic,
            dueDate: formatDueDate(a.dueDate),
            isAssignment: true,
            description: a.description
          }))
          .sort((a: DueItem, b: DueItem) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );

        setQuizzes(sortedQuizzes);
        setAssignments(sortedAssignments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  if (loading) {
    return (
      <Box className={styles.container}>
        <Typography>Loading items...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.container}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        className={styles.backButton}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" className={styles.pageTitle}>
        All Due Items
      </Typography>

      <div className={styles.columnsWrapper}>
        {/* Assignments Column */}
        <div className={styles.column}>
          <Typography variant="h5" className={styles.sectionTitle}>
            Assignments
          </Typography>
          {assignments.length > 0 ? (
            assignments.map(assignment => (
              <DueItemCard
                key={assignment._id}
                title={assignment.title}
                course={assignment.course}
                topic={assignment.topic}
                dueDate={assignment.dueDate}
                isAssignment={true}
              />
            ))
          ) : (
            <Typography className={styles.noItems}>No assignments available</Typography>
          )}
        </div>

        {/* Quizzes Column */}
        <div className={styles.column}>
          <Typography variant="h5" className={styles.sectionTitle}>
            Quizzes
          </Typography>
          {quizzes.length > 0 ? (
            quizzes.map(quiz => (
              <DueItemCard
                key={quiz._id}
                title={quiz.title}
                course={quiz.course}
                topic={quiz.topic}
                dueDate={quiz.dueDate}
                isAssignment={false}
              />
            ))
          ) : (
            <Typography className={styles.noItems}>No quizzes available</Typography>
          )}
        </div>
      </div>
    </Box>
  );
};

export default AllDueItemsPage;