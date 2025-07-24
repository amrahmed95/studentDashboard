export interface Announcement {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  course?: {
    id: string;
    name: string;
  };
  message: string;
  createdAt: Date;
}