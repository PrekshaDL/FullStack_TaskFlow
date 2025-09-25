import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  user: User = {
    name: '',
    email: '',
    password: '',
    role: 'USER'
  };
  
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    console.log('Loading user profile...');
    this.isLoading = true;
    // fallback: use getUsers to simulate current user since service lacks getCurrentUser
    this.userService.getUsers(0, 1).subscribe({
      next: (page) => {
        const user = (page?.content && page.content[0]) as User | undefined;
        console.log('User profile loaded:', user);
        this.user = user || this.user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.errorMessage = 'Failed to load user profile - Using mock data';
        this.isLoading = false;
        this.createMockUser();
      }
    });
  }

  createMockUser(): void {
    this.user = {
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
        { id: 1, title: 'Task 1', status: 'DONE', priority: 'HIGH' },
        { id: 2, title: 'Task 2', status: 'IN_PROGRESS', priority: 'MEDIUM' },
        { id: 3, title: 'Task 3', status: 'TODO', priority: 'LOW' }
      ],
      notifications: [
        { id: 1, title: 'Welcome', message: 'Welcome to TaskFlow!', isRead: false }
      ],
      activityLogs: [
        { id: 1, action: 'LOGIN', description: 'User logged in' },
        { id: 2, action: 'TASK_CREATED', description: 'Created new task' }
      ]
    };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserProfile(); // Reset to original data
    }
  }

  saveProfile(): void {
    if (!this.user.name || !this.user.email) {
      this.errorMessage = 'Name and email are required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request$ = this.user.id
      ? this.userService.updateUser(this.user.id, this.user)
      : this.userService.createUser(this.user);

    request$.subscribe({
      next: (updatedUser: User) => {
        this.user = updatedUser;
        this.isEditing = false;
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error: unknown) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Failed to update profile';
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserProfile();
    this.errorMessage = '';
  }
}
