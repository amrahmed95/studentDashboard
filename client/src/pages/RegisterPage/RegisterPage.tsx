import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Joi from 'joi';
import styles from './Register.module.css';

interface Course {
  _id: string;
  name: string;
  code: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    enrolledCourses: [] as Course[],
    assignedCourses: [] as Course[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/course');
        const data = await response.json();
        if (response.ok) {
          setCourses(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);
        } else {
          throw new Error(data.message || 'Failed to fetch courses');
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch courses');
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // DEBUG: console.log("Courses", courses);


  const signUpSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
    email: Joi.string().email({ tlds: false }).required().label('Email'),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{6,100}$'))
      .min(6)
      .max(100)
      .required()
      .label('Password'),
    confirmPassword: Joi.valid(Joi.ref('password')).required().label('Confirm Password'),
    role: Joi.string().valid('student', 'teacher').required().label('Role'),
    enrolledCourses: Joi.when('role', {
      is: 'student',
      then: Joi.array().items(
        Joi.object({
          _id: Joi.string().required(),
          name: Joi.string().required(),
          code: Joi.string().required()
        })
      ).min(1).required().label('Enrolled Courses')
    }),
    assignedCourses: Joi.when('role', {
        is: 'teacher',
        then: Joi.array().items(
          Joi.object({
            _id: Joi.string().required(),
            name: Joi.string().required(),
            code: Joi.string().required()
          })
        ).min(1).required().label('Assigned Courses')
      })
  });

  const validateForm = (data: typeof form) => {
    const transformed = {
      ...data,
      enrolledCourses: data.enrolledCourses?.map((c) => c.code),
      assignedCourses: data.assignedCourses?.map((c) => c.code),
    };

    const { error } = signUpSchema.validate(transformed, { abortEarly: false });
    if (error) {
      const fieldErrors: Record<string, string> = {};
      error.details.forEach((e) => {
        if (e.context?.key) {
          fieldErrors[e.context.key] = e.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      // Reset courses when role changes
      ...(name === 'role' ? {
        enrolledCourses: [],
        assignedCourses: []
      } : {})
    }));
  };

  const handleCourseChange = (course: Course) => {
    const field = form.role === 'student' ? 'enrolledCourses' : 'assignedCourses';

    // Check if course exists by _id
    const courseExists = form[field].some(c => c._id === course._id);

    setForm(prev => ({
      ...prev,
      [field]: courseExists
        ? prev[field].filter(c => c._id !== course._id) // Remove if exists
        : [...prev[field], course] // Add if doesn't exist
    }));
  };
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (validateForm(form)) {
      console.warn("Validation failed", form);
      return
    };

    setLoading(true);
    try {

      const courseCodes = form.role === 'student'
        ? form.enrolledCourses.map(c => c.code)
        : form.assignedCourses.map(c => c.code);

      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
          ...(form.role === 'student'
            ? { enrolledCourses: courseCodes }
            : { assignedCourses: courseCodes })
        })
      });

      const data = await response.json();

      // DEBUG:
      console.log("Data :", data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Storing user data in localStorage with full course objects

      // localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: form.username,
        email: form.email,
        role: form.role,
        enrolledCourses: form.role === 'student' ? form.enrolledCourses : [],
        assignedCourses: form.role === 'teacher' ? form.assignedCourses : []
      }));

      // const { id, username, email, role, token, enrolledCourses, assignedCourses } = data.data;
      // register({ email, username, role, enrolledCourses, assignedCourses, token });

      // console.log("Token: ", data.data.token);

      setSuccessMessage('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2>Create Account</h2>
      <p>Fill in the details below to create your account.</p>

      {loading && <div className={styles.spinner}></div>}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}

      <form onSubmit={submitForm}>
        {/* Existing fields */}
        <div className={styles.formGroup}>
          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
            placeholder="Enter username"
          />
          {errors.username && <span className={styles.error}>{errors.username}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter email"
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter password"
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            type="password"
            placeholder="Re-enter password"
          />
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}
        </div>

        {/* Role selection */}
        <div className={styles.formGroup}>
          <label>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {errors.role && <span className={styles.error}>{errors.role}</span>}
        </div>

        {/* Debug: console.log('courses before loading', courses) */}

        {!coursesLoading && (
          <div className={styles.formGroup}>

            <label>
              {form.role === 'student' ? 'Enrolled Courses' : 'Assigned Courses'}
              <span className={styles.requiredAsterisk}>*</span>
            </label>
            <div className={styles.courseList}>
              {courses.map(course => (
                <div key={course._id} className={styles.courseCheckboxContainer}>
                  <input
                    type="checkbox"
                    id={`course-${course._id}`}
                    checked={
                      form.role === 'student'
                        ? form.enrolledCourses.some(c => c._id === course._id)
                        : form.assignedCourses.some(c => c._id === course._id)
                    }
                    onChange={() => handleCourseChange(course)}
                    className={styles.courseCheckbox}
                  />
                  <label
                    htmlFor={`course-${course._id}`}
                    className={styles.courseLabel}
                  >
                    <span className={styles.courseName}>{course.name}</span>
                    <span className={styles.courseCode}>({course.code})</span>
                  </label>
                </div>
              ))}
            </div>
            {form.role === 'student' && errors.enrolledCourses && (
              <span className={styles.error}>{errors.enrolledCourses}</span>
            )}
            {form.role === 'teacher' && errors.assignedCourses && (
              <span className={styles.error}>{errors.assignedCourses}</span>
            )}
          </div>
        )}


        <button type="submit" disabled={loading || coursesLoading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;