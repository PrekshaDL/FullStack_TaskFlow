// src/app/models/user.model.ts

export interface User {
  id?: number;   // optional because when creating a user, id is not required
  name: string;
  firstName?: string;  // user's first name
  lastName?: string;   // user's last name
  email: string;
  password?: string;
  role: string;  // e.g., ADMIN, USER

  // Relations (optional for frontend unless you need nested objects)
  projects?: any[];
  tasks?: any[];
  notifications?: any[];
  activityLogs?: any[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}