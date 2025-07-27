import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './Addquiz.module.css';

interface Course {
  _id: string;
  name: string;
  code: string;
}

const AddQuiz: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    topic: '',
    description: '',
    dueDate: '',
    duration: 0
  });
  const [error, setError] = useState('');
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load teacher's assigned courses
    const courses = JSON.parse(localStorage.getItem('assignedCourses') || '[]');
    setAssignedCourses(courses);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          dueDate: new Date(formData.dueDate).toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      navigate('/all-due-items');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.header}>
        Create New Quiz
      </Typography>

      {error && (
        <Typography className={styles.error}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          className={styles.textField}
          label="Title"
          fullWidth
          margin="normal"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />

        <TextField
          className={`${styles.textField} ${styles.selectField}`}
          select
          label="Course"
          fullWidth
          margin="normal"
          value={formData.course}
          onChange={(e) => setFormData({...formData, course: e.target.value})}
          required
          SelectProps={{
            native: true,
          }}
        >
          <option value=""></option>
          {assignedCourses.map((course) => (
            <option key={course._id} value={course.code}>
              {course.name} ({course.code})
            </option>
          ))}
        </TextField>

        <TextField
          className={styles.textField}
          label="Topic"
          fullWidth
          margin="normal"
          value={formData.topic}
          onChange={(e) => setFormData({...formData, topic: e.target.value})}
          required
        />

        <TextField
          className={`${styles.textField} ${styles.datetimeInput}`}
          label="Due Date & Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={formData.dueDate}
          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          required
        />

        <TextField
          className={styles.textField}
          label="Duration (minutes)"
          type="number"
          fullWidth
          margin="normal"
          value={formData.duration}
          onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
          required
        />

        <TextField
          className={styles.textField}
          label="Description"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />

        <Box className={styles.buttonGroup}>
          <Button
            type="submit"
            className={styles.submitButton}
          >
            Create quiz
          </Button>
          <Button
            className={styles.cancelButton}
            onClick={() => navigate('/all-due-items')}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddQuiz;