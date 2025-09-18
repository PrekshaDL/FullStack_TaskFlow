import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task.html',
  styleUrls: ['./task.css']
})
export class Task implements OnInit {
  taskForm: FormGroup;
  tasks: any[] = [];
  isEditing = false;
  editTaskId: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['TODO', Validators.required],
      priority: ['MEDIUM', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.http.get<any[]>('http://localhost:8080/api/tasks/all')
      .subscribe(data => this.tasks = data);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    if (this.isEditing && this.editTaskId !== null) {
      this.http.put(`http://localhost:8080/api/tasks/${this.editTaskId}`, this.taskForm.value)
        .subscribe(() => {
          this.loadTasks();
          this.cancelEdit();
        });
    } else {
      this.http.post('http://localhost:8080/api/tasks', this.taskForm.value)
        .subscribe(() => {
          this.loadTasks();
          this.taskForm.reset({ status: 'TODO', priority: 'MEDIUM' });
        });
    }
  }

  editTask(task: any): void {
    this.isEditing = true;
    this.editTaskId = task.id;
    this.taskForm.patchValue(task);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editTaskId = null;
    this.taskForm.reset({ status: 'TODO', priority: 'MEDIUM' });
  }

  deleteTask(id: number): void {
    this.http.delete(`http://localhost:8080/api/tasks/${id}`)
      .subscribe(() => this.loadTasks());
  }
}
