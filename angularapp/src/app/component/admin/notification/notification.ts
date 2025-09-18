import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class Notification implements OnInit {
  notifications: any[] = [];
  notificationForm: FormGroup;
  isEditing = false;
  currentNotificationId: number | null = null;

  private apiUrl = 'http://localhost:8080/api/notifications'; // Adjust port if needed

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.notificationForm = this.fb.group({
      message: ['', Validators.required],
      type: ['INFO', Validators.required],
      isRead: [false]
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.http.get<any[]>(`${this.apiUrl}/all`).subscribe(data => {
      this.notifications = data;
    });
  }

  saveNotification(): void {
    if (this.notificationForm.invalid) return;

    const notificationData = this.notificationForm.value;

    if (this.isEditing && this.currentNotificationId !== null) {
      // Update
      this.http.put(`${this.apiUrl}/${this.currentNotificationId}`, notificationData).subscribe(() => {
        this.loadNotifications();
        this.cancelEdit();
      });
    } else {
      // Create
      this.http.post(this.apiUrl, notificationData).subscribe(() => {
        this.loadNotifications();
        this.notificationForm.reset({ type: 'INFO', isRead: false });
      });
    }
  }

  editNotification(notification: any): void {
    this.isEditing = true;
    this.currentNotificationId = notification.id;
    this.notificationForm.patchValue(notification);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentNotificationId = null;
    this.notificationForm.reset({ type: 'INFO', isRead: false });
  }

  deleteNotification(id: number): void {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.loadNotifications();
      });
    }
  }

  toggleRead(notification: any): void {
    const updated = { ...notification, isRead: !notification.isRead };
    this.http.put(`${this.apiUrl}/${notification.id}`, updated).subscribe(() => {
      this.loadNotifications();
    });
  }
}
