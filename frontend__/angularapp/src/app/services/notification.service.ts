// src/app/services/notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  // ✅ Get all notifications
  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/all`);
  }

  // ✅ Get single notification by ID
  getNotificationById(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  // ✅ Get all notifications for a user
  getNotificationsByUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`);
  }

  // ✅ Get unread notifications for a user
  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread/${userId}`);
  }

  // ✅ Create notification
  createNotification(notification: Notification): Observable<Notification> {
    const notificationPayload = { ...notification, userId: notification.user?.id };
    delete notificationPayload.user;
    return this.http.post<Notification>(this.apiUrl, notificationPayload);
  }

  // ✅ Update notification
  updateNotification(id: number, notification: Notification): Observable<Notification> {
    const notificationPayload = { ...notification, userId: notification.user?.id };
    delete notificationPayload.user;
    return this.http.put<Notification>(`${this.apiUrl}/${id}`, notificationPayload);
  }

  // ✅ Delete notification
  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
