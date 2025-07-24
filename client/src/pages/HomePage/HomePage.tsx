import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Coligo</h1>
        <p className={styles.subtitle}>
          Your gateway to educational excellence.
          Login or register to access your personalized dashboard.
        </p>

        <div className={styles.buttonGroup}>
          <Link to="/login" className={`${styles.authButton} ${styles.loginButton}`}>
            Login
          </Link>
          <Link
            to="/register"
            className={`${styles.authButton} ${styles.secondaryButton} ${styles.registerButton}`}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;