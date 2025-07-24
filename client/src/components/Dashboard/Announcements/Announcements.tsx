import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import AnnouncementCard from './AnnouncementCard';
import styles from './Announcements.module.css';

const Announcements: React.FC = () => {
  // Dummy data
  const announcements = [
    {
      id: 1,
      author: 'Mr Ahmed Mostafa',
      course: 'Math 101',
      message: 'Hi my hmph! I just want you ready to our events and focus on remaining esteemens to gain more grades, good luck my warriors 😊'
    },
    {
      id: 2,
      author: 'Mrs-Salma Ahmed',
      course: 'Physics 02',
      message: 'Hello my students, I want to announce that the next quit will be within 3 days and will cover the whole unit2r Aid and subtract number. Study hard Good luck!'
    },
    {
      id: 3,
      author: 'School management',
      message: 'Congoooooooooad morning, Warnois! That get-really-for-bis-dily call is haard each morning by 050 students at Goodvap Junior High School in Tajamod. Eight. I just want you ready to our exams and focus on remaining esteemens to gain more grades, good luck my warriors 😊'
    },
    {
      id: 4,
      author: 'Events Manager',
      message: 'Helloooo, Can\'t wait our upcoming trip on the next weekend. The trip will be to Dreampark and Pyramid. So to book your seat please contact your class teacher.'
    }
  ];

  return (
    <Card className={styles.announcementsCard}>
      <CardContent>
        <Typography variant="h6" component="div" className={styles.title}>
          Announcements
        </Typography>
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            author={announcement.author}
            course={announcement.course}
            message={announcement.message}
          />
        ))}
        {announcements.length === 0 && (
          <Typography variant="body2" color="textSecondary" className={styles.noAnnouncements}>
            No announcements available.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default Announcements;