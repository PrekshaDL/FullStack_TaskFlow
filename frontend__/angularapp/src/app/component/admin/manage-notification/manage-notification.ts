import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification.model';

@Component({
  selector: 'app-manage-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-notification.html',
  styleUrls: ['./manage-notification.css']
})
export class ManageNotificationComponent implements OnInit {
  notifications: Notification[] = [];
  newNotification: Notification = { title: '', message: '', type: 'INFO', isRead: false };
  targetUserId?: number;
  isLoading = false;
  errorMessage = '';
  page = 0;
  size = 10;
  totalPages = 1;
  filterType = '';
  filterStatus = '';
  searchKeyword = '';
  showCreateForm = false;

  constructor(private service: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.service.getAllNotifications().subscribe({
      next: (notifs) => { 
        this.notifications = notifs; 
        this.isLoading = false; 
        this.errorMessage = '';
      },
      error: () => { 
        this.errorMessage = 'Failed to load notifications'; 
        this.isLoading = false; 
      }
    });
  }

  create(): void {
    const payload = { ...this.newNotification } as Notification;
    // optionally include userId if your backend supports it in the body
    (payload as any).userId = this.targetUserId;
    this.service.createNotification(payload).subscribe(() => {
      this.newNotification = { title: '', message: '', type: 'INFO', isRead: false };
      this.targetUserId = undefined;
      this.showCreateForm = false;
      this.loadNotifications();
    });
  }

  delete(id?: number): void {
    if (!id) return;
    this.service.deleteNotification(id).subscribe(() => this.loadNotifications());
  }

  applyFilters(): void {
    this.page = 0;
    this.loadNotifications();
  }

  setPage(p: number): void {
    this.page = p;
    this.loadNotifications();
  }

  resetForm(): void {
    this.newNotification = { title: '', message: '', type: 'INFO', isRead: false };
    this.targetUserId = undefined;
    this.showCreateForm = false;
  }

  markAsRead(notification: Notification): void {
    if (notification.id) {
      const updatedNotification = { ...notification, isRead: true };
      this.service.updateNotification(notification.id, updatedNotification).subscribe(() => {
        this.loadNotifications();
      });
    }
  }

  markAllAsRead(): void {
    // Implement mark all as read functionality
    console.log('Marking all notifications as read...');
    // This would typically call a service method to mark all as read
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }
}
