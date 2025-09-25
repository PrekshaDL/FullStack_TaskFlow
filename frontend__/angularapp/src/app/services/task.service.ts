// src/app/services/task.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8080/api/tasks'; // backend endpoint

  constructor(private http: HttpClient) {}

  // ✅ Get paginated tasks
  getTasks(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // ✅ Get single task
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // ✅ Create task
  createTask(task: Task): Observable<Task> {
    const taskPayload = { ...task, boardId: task.boardId, assigneeId: task.assigneeId };
    delete taskPayload.board;
    delete taskPayload.assignee;
    return this.http.post<Task>(this.apiUrl, taskPayload);
  }

  // ✅ Update task
  updateTask(id: number, task: Task): Observable<Task> {
    const taskPayload = { ...task, boardId: task.boardId, assigneeId: task.assigneeId };
    delete taskPayload.board;
    delete taskPayload.assignee;
    return this.http.put<Task>(`${this.apiUrl}/${id}`, taskPayload);
  }

  // ✅ Delete task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
