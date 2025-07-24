import React from 'react';
import { Avatar } from '@mui/material';
import styles from './Announcements.module.css';

interface AnnouncementCardProps {
  author: string;
  course?: string;
  message: string;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  author,
  course,
  message,
}) => {
  return (
    <div className={styles.announcementItem}>
      <div className={styles.leftSection}>
        <div className={styles.authorInfo}>
          <Avatar className={styles.avatar} alt={author} src="/static/images/avatar/1.jpg" />
          <div>
            <div className={styles.authorName}>{author}</div>
            {course && <div className={styles.course}>{course}</div>}
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.rightSection}>
        <div className={styles.message}>
          {message.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;