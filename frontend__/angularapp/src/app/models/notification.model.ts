// src/app/models/notification.model.ts

import { User } from './user.model';

export interface Notification {
  id?: number;       // optional when creating a new notification
  title?: string;    // notification title
  message: string;   // notification message
  type?: string;     // INFO, WARNING, ALERT, SUCCESS
  priority?: string; // LOW, MEDIUM, HIGH, URGENT
  isRead: boolean;   // maps to @Column(name="is_read")
  timestamp?: Date;  // notification timestamp

  user?: User;       // ManyToOne relation with User
}
