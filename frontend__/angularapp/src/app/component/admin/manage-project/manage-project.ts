import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  owner?: any;
  boards?: any[];
  ownerId?: number;
}

@Component({
  selector: 'app-manage-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-project.html',
  styleUrls: ['./manage-project.css']
})
export class ManageProjectComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  newProject: Partial<Project> = {};
  editProject: Partial<Project> = {};
  page: number = 0;
  size: number = 10;
  totalPages: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects(this.page, this.size).subscribe(res => {
      this.projects = res.content || res;
      this.totalPages = res.totalPages || 1;
    });
  }

  selectProject(project: Project) {
    this.selectedProject = project;
    this.editProject = { ...project };
  }

  createProject() {
    this.projectService.createProject(this.newProject as Project).subscribe(() => {
      this.newProject = {};
      this.loadProjects();
    });
  }

  quickCreateProject() {
    const name = prompt('Project name?');
    if (!name) return;
    const ownerId = Number(prompt('Owner user id (optional)?') || '');
    const payload: any = { name, status: 'PLANNED' };
    if (ownerId) payload.ownerId = ownerId;
    this.projectService.createProject(payload).subscribe(() => this.loadProjects());
  }

  updateProject() {
    if (!this.editProject.id) return;
    this.projectService.updateProject(this.editProject.id, this.editProject as Project).subscribe(() => {
      this.selectedProject = null;
      this.editProject = {};
      this.loadProjects();
    });
  }

  deleteProject(id: number) {
    this.projectService.deleteProject(id).subscribe(() => {
      this.selectedProject = null;
      this.loadProjects();
    });
  }

  assignProject(project: Project) {
    const ownerId = Number(prompt('Assign owner user id?') || '');
    if (!ownerId) return;
    const body = { ...project, ownerId } as any;
    this.projectService.updateProject(project.id, body).subscribe(() => this.loadProjects());
  }

  setPage(p: number) {
    this.page = p;
    this.loadProjects();
  }
}
