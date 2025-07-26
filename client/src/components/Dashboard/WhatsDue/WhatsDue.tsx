import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DueItemCard from './DueItemCard';
import styles from './WhatsDue.module.css';
import { useNavigate } from 'react-router-dom';

interface DueItem {
  _id: string;
  title: string;
  course: string;
  topic: string;
  dueDate: string;
  isAssignment: boolean;
  description?: string;
}

const WhatsDue: React.FC = () => {
  const [nearestQuiz, setNearestQuiz] = useState<DueItem | null>(null);
  const [nearestAssignment, setNearestAssignment] = useState<DueItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDueItems = async () => {
      try {
        setLoading(true);

        // Fetch quizzes and assignments in parallel
        const [quizzesRes, assignmentsRes] = await Promise.all([
          fetch('http://localhost:3000/api/quiz/'),
          fetch('http://localhost:3000/api/assignment')
        ]);

        if (!quizzesRes.ok || !assignmentsRes.ok) {
          throw new Error('Failed to fetch due items');
        }

        const quizzesData = await quizzesRes.json();
        const assignmentsData = await assignmentsRes.json();

        // Format due date to match your screenshot (20 Dec 2017 - 09:00 PM)
        const formatDueDate = (dateString: string) => {
          const date = new Date(dateString);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${day} ${month} ${year} - ${hours}:${minutes} ${parseInt(hours) >= 12 ? 'PM' : 'AM'}`;
        };

        // Process quizzes and find the nearest one
        if (quizzesData.data?.length > 0) {
          const sortedQuizzes = quizzesData.data
            .map((quiz: any) => ({
              _id: quiz._id,
              title: quiz.title,
              course: quiz.course,
              topic: quiz.topic,
              dueDate: formatDueDate(quiz.dueDate),
              isAssignment: false,
              description: quiz.description
            }))
            .sort((a: DueItem, b: DueItem) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );

          setNearestQuiz(sortedQuizzes[0]);
        }

        if (assignmentsData.data?.length > 0) {
          const sortedAssignments = assignmentsData.data
            .map((assignment: any) => ({
              _id: assignment._id,
              title: assignment.title,
              course: assignment.course,
              topic: assignment.topic,
              dueDate: formatDueDate(assignment.dueDate),
              isAssignment: true,
              description: assignment.description
            }))
            .sort((a: DueItem, b: DueItem) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );

          setNearestAssignment(sortedAssignments[0]);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load due items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDueItems();
  }, []);

  const handleViewAll = () => {
    navigate('/all-due-items'); // Update this path as needed
  };

  if (loading) {
    return (
      <Card className={styles.whatsDueCard}>
        <CardContent>
          <Typography>Loading due items...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.whatsDueCard}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.whatsDueCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div" className={styles.title}>
            What's due
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={handleViewAll}
            className={styles.viewAllButton}
          >
            All
          </Button>
        </Box>

        {/* Quiz Section */}
        <Typography variant="subtitle2" component="div" className={styles.sectionTitle}>
          <QuizIcon className={styles.sectionIcon} /> Quiz
        </Typography>
        {nearestQuiz ? (
          <DueItemCard
            title={nearestQuiz.title}
            course={nearestQuiz.course}
            topic={nearestQuiz.topic}
            dueDate={nearestQuiz.dueDate}
            isAssignment={false}
          />
        ) : (
          <Typography variant="body2" color="textSecondary" className={styles.noItems}>
            No upcoming quizzes
          </Typography>
        )}

        {/* Assignment Section */}
        <Typography variant="subtitle2" component="div" className={styles.sectionTitle} style={{ marginTop: '16px' }}>
          <AssignmentIcon className={styles.sectionIcon} /> Assignment
        </Typography>
        {nearestAssignment ? (
          <DueItemCard
            title={nearestAssignment.title}
            course={nearestAssignment.course}
            topic={nearestAssignment.topic}
            dueDate={nearestAssignment.dueDate}
            isAssignment={true}
          />
        ) : (
          <Typography variant="body2" color="textSecondary" className={styles.noItems}>
            No upcoming assignments
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsDue;