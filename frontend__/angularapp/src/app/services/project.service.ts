// src/app/services/project.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'http://localhost:8080/api/projects'; // backend endpoint

  constructor(private http: HttpClient) {}

  // ✅ Get paginated projects
  getProjects(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // ✅ Get single project by ID
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  // ✅ Create project
  createProject(project: Project): Observable<Project> {
    const projectPayload = { ...project, ownerId: project.ownerId };
    delete projectPayload.owner;
    return this.http.post<Project>(this.apiUrl, projectPayload);
  }

  // ✅ Update project
  updateProject(id: number, project: Project): Observable<Project> {
    const projectPayload = { ...project, ownerId: project.ownerId };
    delete projectPayload.owner;
    return this.http.put<Project>(`${this.apiUrl}/${id}`, projectPayload);
  }

  // ✅ Delete project
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
