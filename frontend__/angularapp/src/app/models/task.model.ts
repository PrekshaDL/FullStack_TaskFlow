// src/app/models/task.model.ts

import { User } from './user.model';

export interface Task {
  id?: number;           // optional for new tasks
  title: string;
  description: string;
  status: string;        // TODO, IN_PROGRESS, DONE
  priority: string;      // LOW, MEDIUM, HIGH
  dueDate?: Date;        // task due date

  // relations
  project?: any;         // project this task belongs to
  board?: any;           // if you later define Board model, replace 'any' with Board
  assignee?: User;       // mapped from backend @ManyToOne User
  // For sending IDs to backend
  projectId?: number;
  boardId?: number;
  assigneeId?: number;
}
