import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { UserService } from '../../../services/user.service';
import { User, PageResponse } from '../../../models/user.model';
import { NotificationService } from '../../../services/notification.service';
import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';
import { ActivityLogService } from '../../../services/activitylog.service';
import { Notification } from '../../../models/notification.model';
import { Project } from '../../../models/project.model';
import { Task } from '../../../models/task.model';
import { ActivityLog } from '../../../models/activitylog.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboard implements OnInit, AfterViewInit {
  // User data
  currentUser: User | null = null;
  username = 'User'; // this can be fetched from auth service

  // User management
  users: User[] = [];
  usersPage: PageResponse<User> | null = null;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  searchKeyword = '';
  isLoading = false;
  errorMessage = '';

  // Main stats
  projectsCount = 0;
  totalTasks = 0;
  completedTasks = 0;
  boardsCount = 0;
  activityLogsCount = 0;

  // Growth metrics
  projectsGrowth = 0;
  boardsGrowth = 0;
  activityGrowth = 0;
  taskCompletionRate = 0;

  // Chart instances
  private statusChart!: Chart;
  private projectProgressChart!: Chart;
  private activityTimelineChart!: Chart;
  private teamPerformanceChart!: Chart;

  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private activityLogService = inject(ActivityLogService);

  userNotifications: Notification[] = [];
  userProjects: Project[] = [];
  userTasks: Task[] = [];
  userActivityLogs: ActivityLog[] = [];

  constructor() {
    console.log('UserDashboard constructor - UserService injected:', !!this.userService);
    this.initializeData();
    // Real-time data updates every 3 seconds
    setInterval(() => {
      this.updateRealTimeData();
    }, 3000);
  }

  ngOnInit(): void {
    console.log('UserDashboard ngOnInit called');
    // Test service injection
    if (this.userService) {
      console.log('UserService is available');
    } else {
      console.error('UserService is not available!');
    }
    
    try {
      this.loadCurrentUser();
      this.loadUsers();
      this.loadUserSpecificData();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }

  loadUserSpecificData(): void {
    if (this.currentUser?.id) {
      this.notificationService.getNotificationsByUser(this.currentUser.id).subscribe(notifs => this.userNotifications = notifs);
      this.projectService.getProjects().subscribe(res => this.userProjects = res.content.filter((p: Project) => p.owner?.id === this.currentUser?.id));
      this.taskService.getTasks().subscribe(res => this.userTasks = res.content.filter((t: Task) => t.assignee?.id === this.currentUser?.id));
      this.activityLogService.getLogsByUser(this.currentUser.id).subscribe(logs => this.userActivityLogs = logs);
    }
  }

  refreshDashboard(): void {
    this.loadCurrentUser();
    this.loadUsers();
    this.loadUserSpecificData();
    this.initializeData();
  }

  private initializeData() {
    this.projectsCount = Math.floor(Math.random() * 15) + 5;
    this.totalTasks = Math.floor(Math.random() * 100) + 50;
    this.completedTasks = Math.floor(Math.random() * this.totalTasks);
    this.boardsCount = Math.floor(Math.random() * 20) + 8;
    this.activityLogsCount = Math.floor(Math.random() * 25) + 10;
    
    this.calculateGrowthMetrics();
  }

  private calculateGrowthMetrics() {
    this.projectsGrowth = Math.floor(Math.random() * 20) + 5;
    this.boardsGrowth = Math.floor(Math.random() * 15) + 3;
    this.activityGrowth = Math.floor(Math.random() * 30) + 10;
    this.taskCompletionRate = Math.floor((this.completedTasks / this.totalTasks) * 100);
  }

  private updateRealTimeData() {
    // Simulate realistic project management data changes
    this.projectsCount = Math.max(0, Math.floor(this.projectsCount + (Math.random() - 0.5) * 2));
    this.totalTasks = Math.max(10, Math.floor(this.totalTasks + (Math.random() - 0.5) * 3));
    this.completedTasks = Math.min(this.totalTasks, Math.max(0, Math.floor(this.completedTasks + (Math.random() - 0.3) * 2)));
    this.boardsCount = Math.max(0, Math.floor(this.boardsCount + (Math.random() - 0.5) * 2));
    this.activityLogsCount = Math.max(0, Math.floor(this.activityLogsCount + (Math.random() - 0.2) * 3));
    
    this.calculateGrowthMetrics();
    this.updateAllCharts();
  }

  ngAfterViewInit(): void {
    this.initAllCharts();
  }

  // User management methods
  loadCurrentUser(): void {
    console.log('Loading current user...');
    try {
      // Fallback since getCurrentUser is not implemented in service yet
      this.userService.getUsers(0, 1).subscribe({
        next: (page) => {
          const user = (page?.content && page.content[0]) as User | undefined;
          if (user) {
            console.log('Current user loaded:', user);
            this.currentUser = user;
            this.username = user.name;
            this.updateUserStats(user);
            this.loadUserSpecificData(); // Load user-specific data after current user is loaded
          } else {
            this.initializeData();
            this.createMockUser();
          }
        },
        error: (error) => {
          console.error('Error loading current user:', error);
          // Fallback to mock data if API fails
          console.log('Falling back to mock data...');
          this.initializeData();
          this.createMockUser();
        }
      });
    } catch (error) {
      console.error('Error in loadCurrentUser:', error);
      this.initializeData();
      this.createMockUser();
    }
  }

  loadUsers(): void {
    console.log('Loading users...');
    this.isLoading = true;
    try {
      this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
        next: (page) => {
          console.log('Users loaded:', page);
          this.usersPage = page;
          this.users = page.content;
          this.totalPages = page.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.errorMessage = 'Failed to load users - Using mock data';
          this.isLoading = false;
          this.createMockUsers();
        }
      });
    } catch (error) {
      console.error('Error in loadUsers:', error);
      this.isLoading = false;
      this.createMockUsers();
    }
  }

  searchUsers(): void {
    if (this.searchKeyword.trim()) {
      // fallback: filter existing users client-side since service has no search API
      const keyword = this.searchKeyword.toLowerCase();
      this.users = (this.usersPage?.content || this.users).filter(u =>
        (u.name || '').toLowerCase().includes(keyword) ||
        (u.email || '').toLowerCase().includes(keyword)
      );
      this.isLoading = false;
    } else {
      this.loadUsers();
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  updateUserStats(user: User): void {
    this.projectsCount = user.projects?.length || 0;
    this.totalTasks = user.tasks?.length || 0;
    this.completedTasks = user.tasks?.filter(task => task.status === 'DONE').length || 0;
    this.activityLogsCount = user.activityLogs?.length || 0;
    this.boardsCount = Math.floor(Math.random() * 20) + 8; // Mock data for boards
    this.calculateGrowthMetrics();
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = 'Failed to delete user';
        }
      });
    }
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.loadUsers();
  }

  testService(): void {
    console.log('Testing service...');
    console.log('UserService available:', !!this.userService);
    console.log('Making test API call...');
    
    // Test a simple API call
    this.userService.getUsers(0, 5).subscribe({
      next: (data) => {
        console.log('Test API call successful:', data);
        alert('Service is working! Check console for details.');
      },
      error: (error) => {
        console.log('Test API call failed:', error);
        alert('Service test failed - using mock data. Check console for details.');
        this.createMockUsers();
      }
    });
  }

  // Mock data methods for fallback
  createMockUser(): void {
    this.currentUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '***',
      role: 'USER',
      projects: [
        { id: 1, name: 'Project Alpha', description: 'Main project' },
        { id: 2, name: 'Project Beta', description: 'Secondary project' }
      ],
      tasks: [
        { id: 1, title: 'Task 1', description: 'Complete task 1', status: 'DONE', priority: 'HIGH' },
        { id: 2, title: 'Task 2', description: 'Complete task 2', status: 'IN_PROGRESS', priority: 'MEDIUM' },
        { id: 3, title: 'Task 3', description: 'Complete task 3', status: 'TODO', priority: 'LOW' }
      ],
      notifications: [
        { id: 1, title: 'Welcome', message: 'Welcome to TaskFlow!', isRead: false }
      ],
      activityLogs: [
        { id: 1, action: 'LOGIN', description: 'User logged in' },
        { id: 2, action: 'TASK_CREATED', description: 'Created new task' }
      ]
    };
    this.username = this.currentUser!.name;
    this.updateUserStats(this.currentUser!);
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
        tasks: [{ id: 1, title: 'Task 1', description: 'Complete task 1', status: 'DONE', priority: 'HIGH' }]
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: '***',
        role: 'ADMIN',
        projects: [{ id: 2, name: 'Project Beta' }],
        tasks: [{ id: 2, title: 'Task 2', description: 'Complete task 2', status: 'IN_PROGRESS', priority: 'MEDIUM' }]
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        password: '***',
        role: 'USER',
        projects: [{ id: 3, name: 'Project Gamma' }],
        tasks: [{ id: 3, title: 'Task 3', description: 'Complete task 3', status: 'TODO', priority: 'LOW' }]
      }
    ];
    this.usersPage = {
      content: this.users,
      totalElements: 3,
      totalPages: 1,
      size: 10,
      number: 0,
      first: true,
      last: true,
      numberOfElements: 3
    };
    this.totalPages = 1;
  }

  private initAllCharts() {
    this.initStatusChart();
    this.initProjectProgressChart();
    this.initActivityTimelineChart();
    this.initTeamPerformanceChart();
  }

  private initStatusChart() {
    const ctx = document.getElementById('userStatusChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [{
          label: 'Task Status',
          data: [this.totalTasks - this.completedTasks - 10, 10, this.completedTasks],
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

  private initProjectProgressChart() {
    const ctx = document.getElementById('projectProgressChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.projectProgressChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Project A', 'Project B', 'Project C', 'Project D'],
        datasets: [{
          label: 'Progress %',
          data: [75, 60, 90, 45],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
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
            max: 100,
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

  private initActivityTimelineChart() {
    const ctx = document.getElementById('activityTimelineChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.activityTimelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Activities',
          data: [12, 19, 8, 15, 22, 18, 25],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
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

  private initTeamPerformanceChart() {
    const ctx = document.getElementById('teamPerformanceChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.teamPerformanceChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Efficiency', 'Quality', 'Speed', 'Collaboration', 'Innovation'],
        datasets: [{
          label: 'Team Performance',
          data: [85, 90, 75, 88, 82],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3b82f6',
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6'
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
    this.updateProjectProgressChart();
    this.updateActivityTimelineChart();
    this.updateTeamPerformanceChart();
  }

  private updateStatusChart() {
    if (this.statusChart) {
      const todo = this.totalTasks - this.completedTasks - 10;
      const inProgress = 10;
      const done = this.completedTasks;
      this.statusChart.data.datasets[0].data = [todo, inProgress, done];
      this.statusChart.update();
    }
  }

  private updateProjectProgressChart() {
    if (this.projectProgressChart) {
      const newData = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100));
      this.projectProgressChart.data.datasets[0].data = newData;
      this.projectProgressChart.update();
    }
  }

  private updateActivityTimelineChart() {
    if (this.activityTimelineChart) {
      const newData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 5);
      this.activityTimelineChart.data.datasets[0].data = newData;
      this.activityTimelineChart.update();
    }
  }

  private updateTeamPerformanceChart() {
    if (this.teamPerformanceChart) {
      const newData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 30) + 70);
      this.teamPerformanceChart.data.datasets[0].data = newData;
      this.teamPerformanceChart.update();
    }
  }

  // Dashboard helper methods
  getCompletedTasks(): number {
    return this.userTasks.filter(task => task.status === 'DONE').length;
  }

  getCompletionRate(): number {
    if (this.userTasks.length === 0) return 0;
    return Math.round((this.getCompletedTasks() / this.userTasks.length) * 100);
  }

  getProjectProgress(project: Project): number {
    // Mock progress calculation - in real app, this would be calculated based on task completion
    return Math.floor(Math.random() * 100);
  }
}
