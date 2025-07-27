import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DueItemCard from '../../components/Dashboard/WhatsDue/DueItemCard';
import styles from './AllDueItemsPage.module.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface DueItem {
  _id: string;
  title: string;
  course: string;
  topic: string;
  dueDate: string;
  isAssignment: boolean;
  description?: string;
}

interface Course {
  _id: string;
  name: string;
  code: string;
}

const AllDueItemsPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<DueItem[]>([]);
  const [assignments, setAssignments] = useState<DueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role') || 'student';
    setUserRole(role);

    if (role === 'teacher') {
      try {
        const courses = JSON.parse(localStorage.getItem('assignedCourses') || '[]');
        setAssignedCourses(courses);
      } catch (err) {
        console.error('Error parsing assigned courses:', err);
        setAssignedCourses([]);
      }
    }

    fetchAllItems();
  }, []);

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

      setQuizzes(quizData.data.map((q: any) => ({
        _id: q._id,
        title: q.title,
        course: q.course,
        topic: q.topic,
        dueDate: formatDueDate(q.dueDate),
        isAssignment: false,
        description: q.description
      })));

      setAssignments(assignmentData.data.map((a: any) => ({
        _id: a._id,
        title: a.title,
        course: a.course,
        topic: a.topic,
        dueDate: formatDueDate(a.dueDate),
        isAssignment: true,
        description: a.description
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const canManageItem = (courseCode: string) => {
    if (userRole !== 'teacher') return false;
    return assignedCourses.some(course => course.code === courseCode);
  };

  const handleDelete = async (id: string, isAssignment: boolean) => {
    try {
      const endpoint = isAssignment ? 'assignment' : 'quiz';
      const response = await fetch(`http://localhost:3000/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      fetchAllItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleEdit = (item: DueItem) => {
    const endpoint = item.isAssignment ? 'assignment' : 'quiz';
    navigate(`/edit-${endpoint}/${item._id}`);
  };

  const handleAddNew = (isAssignment: boolean) => {
    navigate(isAssignment ? '/new-assignment' : '/new-quiz');
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className={styles.container}>
      <Button variant="outlined" onClick={() => navigate('/dashboard')} className={styles.backButton}>
        Back to Dashboard
      </Button>

      <Typography variant="h4" className={styles.pageTitle}>
        All Due Items
      </Typography>

      <div className={styles.columnsWrapper}>
        {/* Assignments Column */}
        <div className={styles.column}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" className={styles.sectionTitle}>
              Assignments
            </Typography>
            {userRole === 'teacher' && assignedCourses.length > 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleAddNew(true)}
                size="small"
              >
                Add Assignment
              </Button>
            )}
          </Box>

          {assignments.length > 0 ? (
            assignments.map(assignment => (
              <Box key={assignment._id} position="relative" className={styles.itemContainer}>
                <DueItemCard
                  title={assignment.title}
                  course={assignment.course}
                  topic={assignment.topic}
                  description={assignment.description}
                  dueDate={assignment.dueDate}
                  isAssignment={true}
                />
                {canManageItem(assignment.course) && (
                  <Box className={styles.itemActions}>
                    <IconButton
                      onClick={() => handleEdit(assignment)}
                      aria-label="Edit assignment"
                    >
                      <EditIcon fontSize="small" />
                       Edit this assignment
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(assignment._id, true)}
                      aria-label="Delete assignment"
                    >
                      <DeleteIcon fontSize="small" color="error" />
                      Delete this assignment
                    </IconButton>
                  </Box>
                )}
              </Box>
            ))
          ) : (
            <Typography className={styles.noItems}>No assignments available</Typography>
          )}
        </div>

        {/* Quizzes Column */}
        <div className={styles.column}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" className={styles.sectionTitle}>
              Quizzes
            </Typography>
            {userRole === 'teacher' && assignedCourses.length > 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleAddNew(false)}
                size="small"
              >
                Add Quiz
              </Button>
            )}
          </Box>

          {quizzes.length > 0 ? (
            quizzes.map(quiz => (
              <Box key={quiz._id} position="relative" className={styles.itemContainer}>
                <DueItemCard
                  title={quiz.title}
                  course={quiz.course}
                  topic={quiz.topic}
                  description={quiz.description}
                  dueDate={quiz.dueDate}
                  isAssignment={false}
                />
                {canManageItem(quiz.course) && (
                  <Box className={styles.itemActions}>
                    <IconButton
                      onClick={() => handleEdit(quiz)}
                      aria-label="Edit quiz"
                    >
                      <EditIcon fontSize="small" />
                      Edit this quiz
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(quiz._id, false)}
                      aria-label="Delete quiz"
                    >
                      <DeleteIcon fontSize="small" color="error" />
                      Delete this quiz
                    </IconButton>
                  </Box>
                )}
              </Box>
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