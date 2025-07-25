import React from 'react';
import { IconButton, Avatar } from '@mui/material';
import { Search, Notifications, ExitToApp } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import styles from './Topbar.module.css';

interface TopbarProps {
  userName?: string;
  onLogout?: () => void;
  userAvatar?: string;
}

const Topbar: React.FC<TopbarProps> = ({ userName, onLogout, userAvatar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.welcomeText}>Welcome {userName},</div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.icons}>
          <IconButton className={styles.iconButton}>
            <Notifications />
          </IconButton>
          <IconButton className={styles.iconButton}>
            <EmailIcon />
          </IconButton>
          <Avatar
            alt={userName || 'User'}
            src={userAvatar || '/default-avatar.png'}
            className={styles.userAvatar}
          />
          <IconButton
            className={styles.iconButton}
            onClick={handleLogout}
            title="Logout"
          >
            <ExitToApp />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
