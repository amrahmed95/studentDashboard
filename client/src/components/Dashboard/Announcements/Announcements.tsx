import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import AnnouncementCard from './AnnouncementCard';
import styles from './Announcements.module.css';

interface Announcement {
  _id: string;
  createdBy?: {
    username: string;
  };
  title?: string;
  course?: string;
  content: string;
  createdAt?: string;
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/announcement');
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const data = await response.json();

        // Transform the data to match our component's expectations
        const formattedAnnouncements = data.data.map((ann: any) => ({
          _id: ann._id,
          title: ann.title,
          course: ann.course,
          content: ann.content,
          creator: ann.createdBy,
        }));

        console.log("formattedAnnouncements", data.data[0]);

        setAnnouncements(formattedAnnouncements);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load announcements');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);



  if (loading) {
    return (
      <Card className={styles.announcementsCard}>
        <CardContent>
          <Typography>Loading announcements...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.announcementsCard}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.announcementsCard}>
      <CardContent>
        <Typography variant="h6" component="div" className={styles.title}>
          Announcements
        </Typography>
        {announcements.map((announcement) => (
          <AnnouncementCard
            author={ announcement.createdBy?.username ?? "Admin" }
            course={announcement.course}
            message={announcement.content}
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