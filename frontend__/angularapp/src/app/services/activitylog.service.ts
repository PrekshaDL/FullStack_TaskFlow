// src/app/services/activity-log.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityLog } from '../models/activitylog.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {

  private apiUrl = 'http://localhost:8080/api/activitylogs';

  constructor(private http: HttpClient) {}

  // ✅ Get all activity logs
  getAll(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/all`);
  }

  // ✅ Get activity log by ID
  getById(id: number): Observable<ActivityLog> {
    return this.http.get<ActivityLog>(`${this.apiUrl}/${id}`);
  }

  // ✅ Create new activity log
  create(log: ActivityLog): Observable<ActivityLog> {
    // Ensure proper mapping of relations to IDs for the backend
    const logPayload = { ...log, userId: log.user?.id, taskId: log.task?.id, projectId: log.project?.id };
    delete logPayload.user;
    delete logPayload.task;
    delete logPayload.project;
    return this.http.post<ActivityLog>(this.apiUrl, logPayload);
  }

  // ✅ Update existing log
  update(id: number, log: ActivityLog): Observable<ActivityLog> {
    return this.http.put<ActivityLog>(`${this.apiUrl}/${id}`, log);
  }

  // ✅ Delete log
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ Get logs by userId
  getLogsByUser(userId: number): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/by-user/${userId}`);
  }

  // ✅ Get logs after specific timestamp
  getLogsAfter(time: string): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/after/${time}`);
  }
}
