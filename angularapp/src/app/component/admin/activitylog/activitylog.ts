import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-activitylog',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './activitylog.html',
  styleUrls: ['./activitylog.css']
})
export class Activitylog implements OnInit {
  logs: any[] = [];
  logForm: FormGroup;
  isEditing = false;
  currentLogId: number | null = null;

  private apiUrl = 'http://localhost:8080/api/activitylogs'; // ⚡ update port if needed

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.logForm = this.fb.group({
      action: ['', Validators.required],
      performedBy: ['', Validators.required],
      timestamp: [''] // handled automatically if left empty
    });
  }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.http.get<any[]>(`${this.apiUrl}/all`).subscribe(data => {
      this.logs = data;
    });
  }

  saveLog(): void {
    if (this.logForm.invalid) return;

    const logData = {
      ...this.logForm.value,
      timestamp: this.logForm.value.timestamp || new Date() // default now
    };

    if (this.isEditing && this.currentLogId !== null) {
      this.http.put(`${this.apiUrl}/${this.currentLogId}`, logData).subscribe(() => {
        this.loadLogs();
        this.cancelEdit();
      });
    } else {
      this.http.post(this.apiUrl, logData).subscribe(() => {
        this.loadLogs();
        this.logForm.reset();
      });
    }
  }

  editLog(log: any): void {
    this.isEditing = true;
    this.currentLogId = log.id;
    this.logForm.patchValue({
      action: log.action,
      performedBy: log.performedBy,
      timestamp: log.timestamp
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentLogId = null;
    this.logForm.reset();
  }

  deleteLog(id: number): void {
    if (confirm('Are you sure you want to delete this log?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.loadLogs();
      });
    }
  }
}
