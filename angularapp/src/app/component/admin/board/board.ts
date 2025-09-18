import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board implements OnInit {
  boards: any[] = [];
  boardForm: FormGroup;
  isEditing = false;
  currentBoardId: number | null = null;

  private apiUrl = 'http://localhost:8080/api/boards'; // ⚡ adjust port if needed

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.boardForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.http.get<any[]>(`${this.apiUrl}/all`).subscribe(data => {
      this.boards = data;
    });
  }

  saveBoard(): void {
    if (this.boardForm.invalid) return;

    const boardData = this.boardForm.value;

    if (this.isEditing && this.currentBoardId !== null) {
      // Update
      this.http.put(`${this.apiUrl}/${this.currentBoardId}`, boardData).subscribe(() => {
        this.loadBoards();
        this.cancelEdit();
      });
    } else {
      // Create
      this.http.post(this.apiUrl, boardData).subscribe(() => {
        this.loadBoards();
        this.boardForm.reset();
      });
    }
  }

  editBoard(board: any): void {
    this.isEditing = true;
    this.currentBoardId = board.id;
    this.boardForm.patchValue(board);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentBoardId = null;
    this.boardForm.reset();
  }

  deleteBoard(id: number): void {
    if (confirm('Are you sure you want to delete this board?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.loadBoards();
      });
    }
  }
}
