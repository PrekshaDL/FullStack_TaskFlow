// src/app/services/board.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiUrl = 'http://localhost:8080/api/boards';

  constructor(private http: HttpClient) {}

  // ✅ Get paginated boards
  getBoards(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  // ✅ Get single board by ID
  getBoardById(id: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${id}`);
  }

  // ✅ Create board
  createBoard(board: Board): Observable<Board> {
    const boardPayload = { ...board, projectId: board.projectId };
    delete boardPayload.project;
    return this.http.post<Board>(this.apiUrl, boardPayload);
  }

  // ✅ Update board
  updateBoard(id: number, board: Board): Observable<Board> {
    const boardPayload = { ...board, projectId: board.projectId };
    delete boardPayload.project;
    return this.http.put<Board>(`${this.apiUrl}/${id}`, boardPayload);
  }

  // ✅ Delete board
  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ Get boards by project
  getBoardsByProject(projectId: number): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}?projectId=${projectId}`);
  }
}
