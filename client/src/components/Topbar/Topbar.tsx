import React from 'react';
import { IconButton, Avatar } from '@mui/material';
import { Search, Notifications, Mail, ExitToApp } from '@mui/icons-material';
import styles from './Topbar.module.css';

interface TopbarProps {
  userName?: string;
  onLogout?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ userName , onLogout}) => {
  return (
    <div className={styles.topbar}>
      <div className={styles.welcomeText}>Welcome {userName},</div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search fontSize="small" />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.icons}>
          <IconButton className={styles.iconButton}>
            <Notifications fontSize="medium" />
          </IconButton>
          <IconButton className={styles.iconButton}>
            <Mail fontSize="medium" />
          </IconButton>
          <Avatar
            alt="User"
            src="/path/to/user.jpg"
            className={styles.userAvatar}
          />
          <IconButton className={styles.iconButton} onClick={onLogout}>
            <ExitToApp fontSize="medium" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Topbar;