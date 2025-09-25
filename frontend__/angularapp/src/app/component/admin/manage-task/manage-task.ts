import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  board?: any;
  assignee?: any;
  assigneeId?: number;
  boardId?: number;
}

@Component({
  selector: 'app-manage-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-task.html',
  styleUrls: ['./manage-task.css']
})
export class ManageTaskComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  newTask: Partial<Task> = {};
  editTask: Partial<Task> = {};
  page: number = 0;
  size: number = 10;
  totalPages: number = 1;
  filterStatus: string = '';
  filterPriority: string = '';
  searchKeyword: string = '';
  showCreateForm: boolean = false;

  constructor(private http: HttpClient, private notifications: NotificationService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<any>('/api/tasks', { params: { page: this.page, size: this.size, status: this.filterStatus || undefined, priority: this.filterPriority || undefined } as any }).subscribe(res => {
      this.tasks = res.content || res;
      this.totalPages = res.totalPages || 1;
    });
  }

  selectTask(task: Task) {
    this.selectedTask = task;
    this.editTask = { ...task };
  }

  createTask() {
    this.http.post<Task>('/api/tasks', this.newTask).subscribe(() => {
      this.newTask = {};
      this.loadTasks();
    });
  }

  // Single-click helpers
  quickCreateTask() {
    const title = prompt('Task title?');
    if (!title) return;
    const assigneeId = Number(prompt('Assignee user id (optional)?') || '');
    const payload: any = { title, status: 'TODO', priority: 'LOW' };
    if (assigneeId) payload.assigneeId = assigneeId;
    this.http.post<Task>('/api/tasks', payload).subscribe((t) => {
      if (assigneeId) {
        this.notifications.createNotification({ title: 'New Task', message: `You have been assigned: ${title}`, isRead: false } as any).subscribe();
      }
      this.loadTasks();
    });
  }

  updateTask() {
    if (!this.editTask.id) return;
    this.http.put<Task>(`/api/tasks/${this.editTask.id}`, this.editTask).subscribe(() => {
      this.selectedTask = null;
      this.editTask = {};
      this.loadTasks();
    });
  }

  assignTask(task: Task) {
    const assigneeId = Number(prompt('Assign to user id?') || '');
    if (!assigneeId) return;
    const body = { ...task, assigneeId } as any;
    this.http.put<Task>(`/api/tasks/${task.id}`, body).subscribe(() => {
      this.notifications.createNotification({ title: 'Task Assigned', message: `Task '${task.title}' assigned to you`, isRead: false } as any).subscribe();
      this.loadTasks();
    });
  }

  markDone(task: Task) {
    const body = { ...task, status: 'DONE' } as any;
    this.http.put<Task>(`/api/tasks/${task.id}`, body).subscribe(() => this.loadTasks());
  }

  deleteTask(id: number) {
    this.http.delete(`/api/tasks/${id}`).subscribe(() => {
      this.selectedTask = null;
      this.loadTasks();
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadTasks();
  }

  applyFilters() {
    this.page = 0;
    this.loadTasks();
  }

  refreshTasks() {
    this.loadTasks();
  }

  resetForm() {
    this.newTask = {};
    this.showCreateForm = false;
  }
}
