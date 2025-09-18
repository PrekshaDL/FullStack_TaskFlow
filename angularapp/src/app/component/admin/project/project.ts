import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css']
})
export class Project implements OnInit {
  projects: any[] = [];
  projectForm: FormGroup;
  isEditing = false;
  currentProjectId: number | null = null;

  private apiUrl = 'http://localhost:8080/api/projects'; // adjust port if needed

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.http.get<any[]>(`${this.apiUrl}/all`).subscribe(data => {
      this.projects = data;
    });
  }

  saveProject(): void {
    if (this.projectForm.invalid) return;

    const projectData = this.projectForm.value;

    if (this.isEditing && this.currentProjectId !== null) {
      // Update
      this.http.put(`${this.apiUrl}/${this.currentProjectId}`, projectData).subscribe(() => {
        this.loadProjects();
        this.cancelEdit();
      });
    } else {
      // Create
      this.http.post(this.apiUrl, projectData).subscribe(() => {
        this.loadProjects();
        this.projectForm.reset({ status: 'ACTIVE' });
      });
    }
  }

  editProject(project: any): void {
    this.isEditing = true;
    this.currentProjectId = project.id;
    this.projectForm.patchValue(project);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentProjectId = null;
    this.projectForm.reset({ status: 'ACTIVE' });
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.loadProjects();
      });
    }
  }
}
