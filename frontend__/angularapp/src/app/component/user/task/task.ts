import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { Task } from '../../../models/task.model';
import { User } from '../../../models/user.model';
import { ActivityLogService } from '../../../services/activitylog.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task.html',
  styleUrls: ['./task.css']
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  currentUser: User | null = null;
  page: number = 0;
  size: number = 10;
  totalPages: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private activityLogService = inject(ActivityLogService);

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.loadTasks();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load current user for tasks.';
        console.error(err);
      }
    });
  }

  loadTasks(): void {
    if (!this.currentUser?.id) return;

    this.isLoading = true;
    this.taskService.getTasks(this.page, this.size).subscribe({
      next: (res: { content: Task[]; totalPages: number }) => {
        this.tasks = res.content.filter((t: Task) => t.assignee?.id === this.currentUser?.id);
        this.totalPages = res.totalPages || 1;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load tasks.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  markTaskAsDone(taskId: number): void {
    const taskToUpdate = this.tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, status: 'DONE' };
    this.taskService.updateTask(taskId, updatedTask).subscribe({
      next: () => {
        this.loadTasks();
        this.activityLogService.create({ 
          action: 'TASK_COMPLETED', 
          performedBy: this.currentUser?.name || 'User',
          timestamp: new Date().toISOString(),
          taskId: taskId,
          userId: this.currentUser?.id,
          description: `Task '${taskToUpdate.title}' marked as DONE.`
        }).subscribe();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to mark task as done.';
        console.error(err);
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadTasks();
  }

  // Helper methods for task display
  viewTask(task: any): void {
    console.log('Viewing task:', task);
    // Navigate to task details or open modal
  }

  editTask(task: any): void {
    console.log('Editing task:', task);
    // Navigate to task edit or open edit modal
  }
}
