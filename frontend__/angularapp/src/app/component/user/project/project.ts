import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service';
import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  currentUser: User | null = null;
  page: number = 0;
  size: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  isLoading: boolean = false;

  private projectService = inject(ProjectService);
  private userService = inject(UserService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.loadProjects();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load current user.';
        console.error(err);
      }
    });
  }

  loadProjects(): void {
    if (!this.currentUser?.id) return;

    this.isLoading = true;
    this.projectService.getProjects(this.page, this.size).subscribe({
      next: (res: { content: Project[]; totalPages: number }) => {
        this.projects = res.content.filter((p: Project) => p.owner?.id === this.currentUser?.id);
        this.totalPages = res.totalPages || 1;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load projects.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadProjects();
  }

  // Helper methods for project display
  getProjectProgress(project: Project): number {
    // Mock progress calculation - in real app, this would be calculated based on task completion
    return Math.floor(Math.random() * 100);
  }

  getProjectTaskCount(project: Project): number {
    // Mock task count - in real app, this would be fetched from the backend
    return Math.floor(Math.random() * 20) + 5;
  }

  getCompletedTaskCount(project: Project): number {
    // Mock completed task count - in real app, this would be calculated from task status
    const totalTasks = this.getProjectTaskCount(project);
    return Math.floor(totalTasks * (this.getProjectProgress(project) / 100));
  }

  viewProject(project: Project): void {
    console.log('Viewing project:', project);
    // Navigate to project details or open modal
  }

  viewProjectDetails(project: Project): void {
    console.log('Viewing project details:', project);
    // Navigate to detailed project view
  }
}
