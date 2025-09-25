// src/app/models/activity-log.model.ts

import { User } from './user.model';
import { Task } from './task.model';
import { Project } from './project.model';

export interface ActivityLog {
  id?: number;             // optional for new logs
  action: string;
  description?: string; // Add description field
  performedBy: string;
  timestamp: string;       // use string (ISO format) for LocalDateTime

  user?: User;             // relations
  task?: Task;
  project?: Project;
  // For sending IDs to backend
  userId?: number;
  taskId?: number;
  projectId?: number;
}
