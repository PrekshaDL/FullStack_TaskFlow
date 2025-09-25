import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivityLogService } from '../../../services/activitylog.service';
import { UserService } from '../../../services/user.service';
import { ActivityLog } from '../../../models/activitylog.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-activitylog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './activitylog.html',
  styleUrls: ['./activitylog.css']
})
export class ActivityLogComponent implements OnInit {
  logs: ActivityLog[] = [];
  filteredLogs: ActivityLog[] = [];
  currentUser: User | null = null;
  isLoading = false;
  errorMessage = '';
  newLog: ActivityLog = { id: 0, action: '', performedBy: '', timestamp: '', user: undefined, task: undefined, project: undefined, description: '' };
  editingLog: ActivityLog | null = null;
  page = 0;
  size = 10;
  totalPages = 0;
  selectedFilter = 'all';

  private activityLogService = inject(ActivityLogService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadLogs();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load current user for activity logs.';
        console.error(err);
        // Fallback to mock data
        this.createMockUser();
      }
    });
  }

  loadLogs(): void {
    if (!this.currentUser?.id) return;

    this.isLoading = true;
    this.activityLogService.getLogsByUser(this.currentUser.id).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.filteredLogs = logs;
        this.totalPages = 1; // Assuming getLogsByUser returns all for now, adjust if paginated
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load activity logs.';
        console.error(err);
        this.isLoading = false;
        // Fallback to mock data
        this.createMockLogs();
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadLogs();
  }

  // Filter methods
  filterLogs(): void {
    if (this.selectedFilter === 'all') {
      this.filteredLogs = this.logs;
    } else {
      this.filteredLogs = this.logs.filter(log => 
        log.action.toLowerCase().includes(this.selectedFilter.toLowerCase())
      );
    }
  }

  // Activity icon methods
  getActivityIcon(action: string): string {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login') || actionLower.includes('logout')) {
      return 'fas fa-sign-in-alt';
    } else if (actionLower.includes('task')) {
      return 'fas fa-tasks';
    } else if (actionLower.includes('project')) {
      return 'fas fa-project-diagram';
    } else if (actionLower.includes('board')) {
      return 'fas fa-columns';
    } else {
      return 'fas fa-circle';
    }
  }

  getActivityIconClass(action: string): string {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login') || actionLower.includes('logout')) {
      return 'login';
    } else if (actionLower.includes('task')) {
      return 'task';
    } else if (actionLower.includes('project')) {
      return 'project';
    } else if (actionLower.includes('board')) {
      return 'board';
    } else {
      return 'default';
    }
  }

  // Time formatting
  getTimeAgo(timestamp: string | Date): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  // Mock data methods for fallback
  createMockUser(): void {
    this.currentUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '***',
      role: 'USER'
    };
    this.createMockLogs();
  }

  createMockLogs(): void {
    this.logs = [
      {
        id: 1,
        action: 'LOGIN',
        performedBy: 'John Doe',
        description: 'User logged into the system',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        user: this.currentUser || undefined
      },
      {
        id: 2,
        action: 'TASK_CREATED',
        performedBy: 'John Doe',
        description: 'Created new task: "Complete Dashboard UI"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        user: this.currentUser || undefined,
        task: { id: 1, title: 'Complete Dashboard UI', description: 'Complete the dashboard UI design', status: 'IN_PROGRESS', priority: 'HIGH' }
      },
      {
        id: 3,
        action: 'PROJECT_UPDATED',
        performedBy: 'John Doe',
        description: 'Updated project: "TaskFlow App"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        user: this.currentUser || undefined,
        project: { id: 1, name: 'TaskFlow App', description: 'Main project', status: 'IN_PROGRESS' }
      },
      {
        id: 4,
        action: 'BOARD_ACCESSED',
        performedBy: 'John Doe',
        description: 'Accessed board: "Sprint Planning Board"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        user: this.currentUser || undefined
      },
      {
        id: 5,
        action: 'TASK_COMPLETED',
        performedBy: 'John Doe',
        description: 'Completed task: "Fix Login Bug"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        user: this.currentUser || undefined,
        task: { id: 2, title: 'Fix Login Bug', description: 'Fix the login bug issue', status: 'DONE', priority: 'HIGH' }
      },
      {
        id: 6,
        action: 'PROFILE_UPDATED',
        performedBy: 'John Doe',
        description: 'Updated user profile information',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        user: this.currentUser || undefined
      }
    ];
    this.filteredLogs = this.logs;
    this.totalPages = 1;
    this.isLoading = false;
  }
}
