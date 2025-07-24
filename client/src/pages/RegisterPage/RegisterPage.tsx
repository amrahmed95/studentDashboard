import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';
import styles from './Register.module.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const signUpSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
    email: Joi.string().email({ tlds: false }).required().label('Email'),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{6,100}$'))
      .min(6)
      .max(100)
      .required()
      .label('Password'),
    confirmPassword: Joi.valid(Joi.ref('password')).required().label('Confirm Password')
  });

  const validateForm = () => {
    const { error } = signUpSchema.validate(form, { abortEarly: false });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('username', form.username);

      setSuccessMessage('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        setSuccessMessage('');
      }, 10000);

      navigate('/dashboard');

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
      {loading && <p>Loading...</p>}
      {loading && <div className={styles.spinner}></div>}

      {!loading && (
        <form onSubmit={submitForm}>
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

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          {successMessage && <p className={styles.success}>{successMessage}</p>}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </form>
      )}
    </div>
  );
};

export default RegisterPage;