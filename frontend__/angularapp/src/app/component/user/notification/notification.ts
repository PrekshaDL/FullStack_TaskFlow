import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification.model';
import { UserService } from '../../../services/user.service';
import { inject } from '@angular/core';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  userId: number | undefined;
  isLoading = false;
  errorMessage = '';
  selectedFilter = 'all';
  searchTerm = '';
  page = 0;
  size = 10;
  totalPages = 0;

  private notificationService = inject(NotificationService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.userId = user.id;
        this.loadNotifications();
      },
      error: (err: any) => {
        this.errorMessage = 'Could not load user for notifications.';
        console.error(err);
        // Fallback to mock data
        this.createMockUser();
      }
    });
  }

  loadNotifications(): void {
    if (this.userId) {
      this.isLoading = true;
      this.notificationService.getNotificationsByUser(this.userId).subscribe({
        next: (notifs: Notification[]) => {
          this.notifications = notifs;
          this.filteredNotifications = notifs;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to load notifications.';
          console.error(err);
          this.isLoading = false;
          // Fallback to mock data
          this.createMockNotifications();
        }
      });
    }
  }

  markAsRead(notification: Notification): void {
    if (notification.id) {
      const updatedNotification = { ...notification, isRead: true };
      this.notificationService.updateNotification(notification.id, updatedNotification).subscribe({
        next: () => this.loadNotifications(),
        error: (err: any) => {
          console.error('Failed to mark as read:', err);
          // Update locally for better UX
          notification.isRead = true;
          this.filterNotifications();
        }
      });
    }
  }

  markAllAsRead(): void {
    const unreadNotifications = this.notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    // Update all unread notifications
    unreadNotifications.forEach(notification => {
      if (notification.id) {
        const updatedNotification = { ...notification, isRead: true };
        this.notificationService.updateNotification(notification.id, updatedNotification).subscribe({
          next: () => {
            notification.isRead = true;
            this.filterNotifications();
          },
          error: (err: any) => console.error('Failed to mark as read:', err)
        });
      }
    });
  }

  deleteNotification(id: number): void {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.notificationService.deleteNotification(id).subscribe({
        next: () => this.loadNotifications(),
        error: (err: any) => {
          console.error('Failed to delete notification:', err);
          // Remove locally for better UX
          this.notifications = this.notifications.filter(n => n.id !== id);
          this.filterNotifications();
        }
      });
    }
  }

  // Filter and search methods
  filterNotifications(): void {
    let filtered = [...this.notifications];

    // Apply type filter
    if (this.selectedFilter !== 'all') {
      if (this.selectedFilter === 'unread') {
        filtered = filtered.filter(n => !n.isRead);
      } else if (this.selectedFilter === 'read') {
        filtered = filtered.filter(n => n.isRead);
      } else {
        filtered = filtered.filter(n => n.type?.toLowerCase() === this.selectedFilter.toLowerCase());
      }
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        (n.title?.toLowerCase().includes(term)) ||
        (n.message?.toLowerCase().includes(term))
      );
    }

    this.filteredNotifications = filtered;
  }

  clearFilters(): void {
    this.selectedFilter = 'all';
    this.searchTerm = '';
    this.filterNotifications();
  }

  setPage(p: number): void {
    this.page = p;
    this.loadNotifications();
  }

  // Helper methods
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getReadCount(): number {
    return this.notifications.filter(n => n.isRead).length;
  }

  getNotificationIcon(type?: string): string {
    if (!type) return 'fas fa-bell';
    
    const typeLower = type.toLowerCase();
    if (typeLower.includes('info')) return 'fas fa-info-circle';
    if (typeLower.includes('warning')) return 'fas fa-exclamation-triangle';
    if (typeLower.includes('alert') || typeLower.includes('error')) return 'fas fa-exclamation-circle';
    if (typeLower.includes('success')) return 'fas fa-check-circle';
    return 'fas fa-bell';
  }

  getNotificationTypeClass(type?: string): string {
    if (!type) return 'default';
    
    const typeLower = type.toLowerCase();
    if (typeLower.includes('info')) return 'info';
    if (typeLower.includes('warning')) return 'warning';
    if (typeLower.includes('alert') || typeLower.includes('error')) return 'alert';
    return 'default';
  }

  // Mock data methods for fallback
  createMockUser(): void {
    this.userId = 1;
    this.createMockNotifications();
  }

  createMockNotifications(): void {
    this.notifications = [
      {
        id: 1,
        title: 'Welcome to TaskFlow!',
        message: 'Welcome to TaskFlow! We\'re excited to have you on board. Start by exploring your dashboard and creating your first project.',
        type: 'info',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        user: { id: 1, name: 'John Doe', email: 'john@example.com', password: '***', role: 'USER' }
      },
      {
        id: 2,
        title: 'Task Assignment',
        message: 'You have been assigned to a new task: "Complete Dashboard UI Design". Please review the requirements and start working on it.',
        type: 'info',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        user: { id: 1, name: 'John Doe', email: 'john@example.com', password: '***', role: 'USER' }
      },
      {
        id: 3,
        title: 'Project Deadline Approaching',
        message: 'The deadline for "Mobile App Development" project is approaching in 3 days. Please ensure all tasks are completed on time.',
        type: 'warning',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        user: { id: 1, name: 'John Doe', email: 'john@example.com', password: '***', role: 'USER' }
      },
      {
        id: 4,
        title: 'System Maintenance',
        message: 'Scheduled system maintenance will occur tonight from 2:00 AM to 4:00 AM. The system may be temporarily unavailable during this time.',
        type: 'alert',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        user: { id: 1, name: 'John Doe', email: 'john@example.com', password: '***', role: 'USER' }
      },
      {
        id: 5,
        title: 'Task Completed',
        message: 'Great job! You have successfully completed the task "Fix Login Bug". Your work has been reviewed and approved.',
        type: 'info',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        user: { id: 1, name: 'John Doe', email: 'john@example.com', password: '***', role: 'USER' }
      },
      {
        id: 6,
        title: 'New Team Member',
        message: 'Sarah Johnson has joined your project team. She will be working on the backend development tasks.',
        type: 'info',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        user: { id: 1, name: 'John Doe', email: 'john@example.com', password: '***', role: 'USER' }
      }
    ];
    this.filteredNotifications = this.notifications;
    this.totalPages = 1;
    this.isLoading = false;
  }
}
