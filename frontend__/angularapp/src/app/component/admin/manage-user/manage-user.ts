import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User, PageResponse } from '../../../models/user.model'; // Import User and PageResponse

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-user.html',
  styleUrls: ['./manage-user.css']
})
export class ManageUserComponent implements OnInit {
  users: User[] = []; // Type to User[]
  isLoading = false;
  errorMessage = '';
  selectedUser: User | null = null;
  newUser: User = { name: '', email: '', password: '', role: 'USER' };
  editUser: Partial<User> = {}; // For editing selected user
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getUsers(this.page, this.size).subscribe({
      next: (pageResponse: PageResponse<User>) => {
        this.users = pageResponse.content;
        this.totalPages = pageResponse.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load users. Showing mock data.';
        console.error('Error loading users:', err);
        this.setMockUsers();
      }
    });
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.errorMessage = 'Name, email, and password are required to create a user.';
      return;
    }
    this.userService.createUser(this.newUser).subscribe({
      next: (u) => {
        this.newUser = { name: '', email: '', password: '', role: 'USER' };
        this.loadUsers();
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to create user.';
        console.error('Error creating user:', err);
      }
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.editUser = { ...user }; // Initialize editUser for the form
  }

  updateUser(): void {
    if (!this.editUser.id) return;
    this.userService.updateUser(this.editUser.id, this.editUser as User).subscribe({
      next: () => {
        this.selectedUser = null;
        this.editUser = {};
        this.loadUsers();
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to update user.';
        console.error('Error updating user:', err);
      }
    });
  }

  deleteUser(id?: number): void {
    if (!id || !confirm('Are you sure you want to delete this user?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete user.';
        console.error('Error deleting user:', err);
      }
    });
  }

  setPage(page: number): void {
    this.page = page;
    this.loadUsers();
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.editUser = {};
  }

  setMockUsers(): void {
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'mockpass1',
        role: 'USER',
        projects: [{ id: 1, name: 'Project Alpha' }],
        tasks: [{ id: 1, title: 'Task 1', status: 'DONE', priority: 'HIGH' }],
        activityLogs: [
          { id: 1, action: 'LOGIN', performedBy: 'John Doe', timestamp: new Date().toISOString() },
          { id: 2, action: 'TASK_CREATED', performedBy: 'John Doe', timestamp: new Date().toISOString() }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'mockpass2',
        role: 'ADMIN',
        projects: [{ id: 2, name: 'Project Beta' }],
        tasks: [{ id: 2, title: 'Task 2', status: 'IN_PROGRESS', priority: 'MEDIUM' }],
        activityLogs: [
          { id: 3, action: 'LOGIN', performedBy: 'Jane Smith', timestamp: new Date().toISOString() }
        ]
      }
    ];
    this.totalPages = 1;
    this.isLoading = false;
  }
}
