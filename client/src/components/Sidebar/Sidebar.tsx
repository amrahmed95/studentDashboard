import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarToday as ScheduleIcon,
  Book as CoursesIcon,
  Grade as GradebookIcon,
  Assessment as PerformanceIcon,
  Announcement as AnnouncementIcon,
} from '@mui/icons-material';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Schedule', icon: <ScheduleIcon /> },
    { text: 'Courses', icon: <CoursesIcon /> },
    { text: 'Gradebook', icon: <GradebookIcon /> },
    { text: 'Performance', icon: <PerformanceIcon /> },
    { text: 'Announcement', icon: <AnnouncementIcon /> },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>Coligo</div>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} className={styles.listItem} disablePadding>
            <ListItemButton className={styles.listItemButton}>
              <ListItemIcon className={styles.listItemIcon}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                className={styles.listItemText}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;