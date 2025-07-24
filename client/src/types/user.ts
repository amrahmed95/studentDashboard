interface BaseUser {
  id: string;
  email: string;
  role: 'student' | 'teacher';
}

export interface Student extends BaseUser {
  firstName: string;
  lastName: string;
  enrolledCourses: string[];
}

export interface Teacher extends BaseUser {
  firstName: string;
  lastName: string;
  teachingCourses: string[];
}