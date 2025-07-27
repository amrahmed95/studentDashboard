import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditAssignment.module.css';

interface Course {
  _id: string;
  name: string;
  code: string;
}

interface AssignmentData {
  title: string;
  course: string;
  topic: string;
  description: string;
  dueDate: string;
  duration: number;
}

const EditAssignment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<AssignmentData>({
    title: '',
    course: '',
    topic: '',
    description: '',
    dueDate: '',
    duration: 15
  });
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load teacher's assigned courses
        const courses = JSON.parse(localStorage.getItem('assignedCourses') || '[]');
        setAssignedCourses(courses);

        // Fetch assignment data
        const response = await fetch(`http://localhost:3000/api/assignment/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error('No assignment data received');
        }

        const data = responseData.data;
        console.log('Assignment Data:', data); // Debugging log

        // Convert ISO date to local datetime format
        const dueDate = new Date(data.dueDate);
        const formattedDate = dueDate.toISOString().slice(0, 16);

        setFormData({
          title: data.title || '',
          course: data.course || (courses.length > 0 ? courses[0].code : ''),
          topic: data.topic || '',
          description: data.description || '',
          dueDate: formattedDate,
          duration: data.duration || 15
        });
      } catch (err) {
        console.error('Error fetching assignment:', err);
        setError(err instanceof Error ? err.message : 'Failed to load assignment');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/assignment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          dueDate: new Date(formData.dueDate).toISOString()
        })
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || 'Failed to update assignment');
      }

      navigate('/all-due-items');
    } catch (err) {
      console.error('Error updating assignment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update assignment');
    }
  };

  if (isLoading) {
    return <Typography className={styles.loading}>Loading assignment data...</Typography>;
  }

  if (error) {
    return (
      <Box className={styles.container}>
        <Typography className={styles.error}>{error}</Typography>
        <Button
          className={styles.submitButton}
          onClick={() => navigate('/all-due-items')}
        >
          Back to Assignments
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.header}>
        Edit Assignment
      </Typography>

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
          onChange={(e) => setFormData({
            ...formData,
            duration: parseInt(e.target.value) || 0
          })}
          required
          inputProps={{ min: 1 }}
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
            Update Assignment
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

export default EditAssignment;