import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { UserService } from '../../../services/user.service';
import { User, PageResponse } from '../../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit, AfterViewInit {
  users: User[] = [];
  usersPage: PageResponse<User> | null = null;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  searchKeyword = '';
  isLoading = false;
  errorMessage = '';
  private userService = inject(UserService);
  // Main stats
  usersCount = 0;
  projectsCount = 0;
  totalTasks = 0;
  completedTasks = 0;
  boardsCount = 0;
  activityLogsCount = 0;

  // Growth metrics
  usersGrowth = 0;
  projectsGrowth = 0;
  boardsGrowth = 0;
  activityGrowth = 0;
  taskCompletionRate = 0;

  // Chart instances
  private statusChart!: Chart;
  private userActivityChart!: Chart;
  private projectTimelineChart!: Chart;
  private performanceChart!: Chart;

  // Additional properties for new UI structure
  recentProjects: any[] = [];
  recentTasks: any[] = [];
  adminNotifications: any[] = [];
  adminActivityLogs: any[] = [];

  constructor() {
    this.initializeData();
    setInterval(() => {
      this.updateRealTimeData();
    }, 3000);
  }

  ngOnInit(): void {
    console.log('AdminDashboard ngOnInit called');
    // Test service injection
    if (this.userService) {
      console.log('UserService is available in AdminDashboard');
    } else {
      console.error('UserService is not available in AdminDashboard!');
    }
    
    try {
      this.loadUsers();
    } catch (error) {
      console.error('Error in AdminDashboard ngOnInit:', error);
    }
  }

  loadUsers(): void {
    console.log('Loading users in AdminDashboard...');
    this.isLoading = true;
    try {
      this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
        next: (page) => {
          console.log('Users loaded in AdminDashboard:', page);
          this.usersPage = page;
          this.users = page.content;
          this.totalPages = page.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading users in AdminDashboard:', error);
          this.errorMessage = 'Failed to load users - Using mock data';
          this.isLoading = false;
          this.createMockUsers();
        }
      });
    } catch (error) {
      console.error('Error in AdminDashboard loadUsers:', error);
      this.isLoading = false;
      this.createMockUsers();
    }
  }

  createMockUsers(): void {
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '***',
        role: 'USER',
        projects: [{ id: 1, name: 'Project Alpha' }],
        tasks: [{ id: 1, title: 'Task 1', status: 'DONE', priority: 'HIGH' }],
        activityLogs: [
          { id: 1, action: 'LOGIN', description: 'User logged in' },
          { id: 2, action: 'TASK_CREATED', description: 'Created new task' }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: '***',
        role: 'ADMIN',
        projects: [{ id: 2, name: 'Project Beta' }],
        tasks: [{ id: 2, title: 'Task 2', status: 'IN_PROGRESS', priority: 'MEDIUM' }],
        activityLogs: [
          { id: 3, action: 'LOGIN', description: 'User logged in' }
        ]
      }
    ];
    this.usersPage = {
      content: this.users,
      totalElements: 2,
      totalPages: 1,
      size: 10,
      number: 0,
      first: true,
      last: true,
      numberOfElements: this.users.length
    };
  }

  private initializeData() {
     this.usersCount = Math.floor(Math.random() * 100) + 20;
     this.projectsCount = Math.floor(Math.random() * 30) + 10;
     this.totalTasks = Math.floor(Math.random() * 200) + 100;
     this.completedTasks = Math.floor(Math.random() * this.totalTasks);
     this.boardsCount = Math.floor(Math.random() * 40) + 15;
     this.activityLogsCount = Math.floor(Math.random() * 50) + 20;
     this.calculateGrowthMetrics();
     this.initializeMockData();
  }

  private initializeMockData() {
    // Mock recent projects
    this.recentProjects = [
      {
        id: 1,
        name: 'Website Redesign',
        description: 'Complete overhaul of the company website',
        status: 'IN_PROGRESS',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        name: 'Mobile App Development',
        description: 'iOS and Android mobile application',
        status: 'PLANNING',
        createdAt: new Date('2024-01-20')
      },
      {
        id: 3,
        name: 'Database Migration',
        description: 'Migrate to new database system',
        status: 'COMPLETED',
        createdAt: new Date('2024-01-10')
      }
    ];

    // Mock recent tasks
    this.recentTasks = [
      {
        id: 1,
        title: 'Update user interface',
        description: 'Implement new UI components',
        status: 'IN_PROGRESS',
        priority: 'HIGH'
      },
      {
        id: 2,
        title: 'Fix authentication bug',
        description: 'Resolve login issues',
        status: 'DONE',
        priority: 'CRITICAL'
      },
      {
        id: 3,
        title: 'Write documentation',
        description: 'Create API documentation',
        status: 'TODO',
        priority: 'MEDIUM'
      }
    ];

    // Mock admin notifications
    this.adminNotifications = [
      {
        id: 1,
        message: 'New user registered: John Doe',
        isRead: false,
        timestamp: new Date()
      },
      {
        id: 2,
        message: 'Project deadline approaching: Website Redesign',
        isRead: false,
        timestamp: new Date(Date.now() - 3600000)
      }
    ];

    // Mock admin activity logs
    this.adminActivityLogs = [
      {
        id: 1,
        action: 'USER_CREATED',
        description: 'Created new user account for Jane Smith',
        timestamp: new Date()
      },
      {
        id: 2,
        action: 'PROJECT_UPDATED',
        description: 'Updated project status to IN_PROGRESS',
        timestamp: new Date(Date.now() - 1800000)
      }
    ];
  }

  private calculateGrowthMetrics() {
     this.usersGrowth = Math.floor(Math.random() * 20) + 5;
     this.projectsGrowth = Math.floor(Math.random() * 25) + 8;
     this.boardsGrowth = Math.floor(Math.random() * 20) + 5;
     this.activityGrowth = Math.floor(Math.random() * 35) + 15;
     this.taskCompletionRate = Math.floor((this.completedTasks / this.totalTasks) * 100);
  }

  private updateRealTimeData() {
    // More dynamic real-time data changes
    const change = (Math.random() - 0.5) * 0.15; // -7.5% to +7.5% change
    
    // Simulate realistic project management data changes
     this.usersCount = Math.max(0, Math.floor(this.usersCount + (Math.random() - 0.5) * 2));
     this.projectsCount = Math.max(0, Math.floor(this.projectsCount + (Math.random() - 0.5) * 2));
     this.totalTasks = Math.max(20, Math.floor(this.totalTasks + (Math.random() - 0.5) * 5));
     this.completedTasks = Math.min(this.totalTasks, Math.max(0, Math.floor(this.completedTasks + (Math.random() - 0.3) * 3)));
     this.boardsCount = Math.max(0, Math.floor(this.boardsCount + (Math.random() - 0.5) * 2));
     this.activityLogsCount = Math.max(0, Math.floor(this.activityLogsCount + (Math.random() - 0.2) * 4));
     this.calculateGrowthMetrics();
     this.updateAllCharts();
  }

  ngAfterViewInit(): void {
    console.log('AdminDashboard ngAfterViewInit called');
    try {
      this.initAllCharts();
    } catch (error) {
      console.error('Error initializing charts in AdminDashboard:', error);
    }
  }

  private initAllCharts() {
    try {
      this.initStatusChart();
      this.initUserActivityChart();
      this.initProjectTimelineChart();
      this.initPerformanceChart();
    } catch (error) {
      console.error('Error in initAllCharts:', error);
    }
  }

  private initStatusChart() {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [{
          label: 'System Overview',
          data: [this.totalTasks - this.completedTasks - 20, 20, this.completedTasks],
          backgroundColor: ['#ee7752', '#23a6d5', '#23d5ab'],
          borderWidth: 2,
          borderColor: '#2c394e'
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#fff' },
            position: 'bottom'
          }
        }
      },
    });
  }

  private initUserActivityChart() {
    const ctx = document.getElementById('userActivityChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.userActivityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Active Users', 'New Users', 'Inactive Users', 'Banned Users'],
        datasets: [{
          label: 'User Count',
          data: [120, 25, 15, 3],
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
          borderWidth: 1,
          borderColor: '#2c394e'
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        },
        plugins: {
          legend: { labels: { color: '#fff' } }
        }
      },
    });
  }

  private initProjectTimelineChart() {
    const ctx = document.getElementById('projectTimelineChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.projectTimelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Projects Created',
          data: [5, 8, 12, 15, 18, 22],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }, {
          label: 'Projects Completed',
          data: [3, 6, 9, 12, 15, 18],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        },
        plugins: {
          legend: { labels: { color: '#fff' } }
        }
      },
    });
  }

  private initPerformanceChart() {
    const ctx = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.performanceChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['System Uptime', 'Response Time', 'User Satisfaction', 'Data Accuracy', 'Security'],
        datasets: [{
          label: 'System Performance',
          data: [95, 88, 92, 98, 90],
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: '#ef4444',
          borderWidth: 2,
          pointBackgroundColor: '#ef4444'
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#fff' }
          }
        },
        plugins: {
          legend: { labels: { color: '#fff' } }
        }
      },
    });
  }

  private updateAllCharts() {
    this.updateStatusChart();
    this.updateUserActivityChart();
    this.updateProjectTimelineChart();
    this.updatePerformanceChart();
  }

  private updateStatusChart() {
    if (this.statusChart) {
      const todo = this.totalTasks - this.completedTasks - 20;
      const inProgress = 20;
      const done = this.completedTasks;
      this.statusChart.data.datasets[0].data = [todo, inProgress, done];
      this.statusChart.update();
    }
  }

  private updateUserActivityChart() {
    if (this.userActivityChart) {
      const newData = Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 10);
      this.userActivityChart.data.datasets[0].data = newData;
      this.userActivityChart.update();
    }
  }

  private updateProjectTimelineChart() {
    if (this.projectTimelineChart) {
      const createdData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 5);
      const completedData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 15) + 3);
      this.projectTimelineChart.data.datasets[0].data = createdData;
      this.projectTimelineChart.data.datasets[1].data = completedData;
      this.projectTimelineChart.update();
    }
  }

  private updatePerformanceChart() {
    if (this.performanceChart) {
      const newData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 80);
      this.performanceChart.data.datasets[0].data = newData;
      this.performanceChart.update();
    }
  }

  // Helper methods for new UI structure
  getProjectProgress(project: any): number {
    // Mock progress calculation - in real app, this would be calculated based on task completion
    return Math.floor(Math.random() * 100);
  }

  refreshDashboard(): void {
    this.initializeData();
    this.loadUsers();
  }
}
