// src/app/models/project.model.ts

import { User } from './user.model';

export interface Project {
  id?: number;            // optional for new projects
  name: string;
  description: string;
  status: string;         // ACTIVE, COMPLETED, etc.
  createdAt?: Date;       // project creation date
  manager?: User;         // project manager

  // relations
  owner?: User;           // maps to backend @ManyToOne User
  boards?: any[];         // later replace with Board[] when you create board.model.ts
  // For sending owner ID to backend
  ownerId?: number;
}
