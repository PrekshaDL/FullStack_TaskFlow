// src/app/models/board.model.ts

import { Project } from './project.model';
import { Task } from './task.model';

export interface Board {
  id?: number;          // optional for new boards
  name: string;
  title?: string;       // made optional since it's not always used
  description?: string; // made optional since it's not always used
  createdAt?: Date;     // board creation date

  // relations
  project?: Project;    // ManyToOne with Project
  tasks?: Task[];       // OneToMany with Task
  // For sending project ID to backend
  projectId?: number;
}
