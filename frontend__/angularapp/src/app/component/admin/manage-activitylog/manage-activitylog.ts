import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivityLogService } from '../../../services/activitylog.service';
import { ActivityLog } from '../../../models/activitylog.model';

@Component({
  selector: 'app-manage-activitylog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-activitylog.html',
  styleUrls: ['./manage-activitylog.css']
})
export class ManageActivityLogComponent implements OnInit {
  logs: ActivityLog[] = [];
  newLog: Partial<ActivityLog> = { action: '', performedBy: '', timestamp: '' };
  isLoading = false;
  errorMessage = '';
  page = 0;
  size = 10;
  totalPages = 1;
  filterAction = '';
  filterUser = '';
  filterDate = '';
  showCreateForm = false;

  constructor(private service: ActivityLogService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (logs) => { 
        this.logs = logs; 
        this.isLoading = false; 
        this.errorMessage = '';
      },
      error: () => { 
        this.errorMessage = 'Failed to load logs'; 
        this.isLoading = false; 
      }
    });
  }

  create(): void {
    this.service.create(this.newLog as ActivityLog).subscribe(() => {
      this.newLog = { action: '', performedBy: '', timestamp: '' };
      this.showCreateForm = false;
      this.loadLogs();
    });
  }

  delete(id?: number): void {
    if (!id) return;
    this.service.delete(id).subscribe(() => this.loadLogs());
  }

  applyFilters(): void {
    this.page = 0;
    this.loadLogs();
  }

  setPage(p: number): void {
    this.page = p;
    this.loadLogs();
  }

  resetForm(): void {
    this.newLog = { action: '', performedBy: '', timestamp: '' };
    this.showCreateForm = false;
  }

  exportLogs(): void {
    // Implement export functionality
    console.log('Exporting logs...');
  }
}
