import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BoardService } from '../../../services/board.service';
import { Board } from '../../../models/board.model';

@Component({
  selector: 'app-manage-board',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-board.html',
  styleUrls: ['./manage-board.css']
})
export class ManageBoardComponent implements OnInit {
  boards: Board[] = [];
  selectedBoard: Board | null = null;
  newBoard: Partial<Board> = {};
  editBoard: Partial<Board> = {};
  page = 0;
  size = 10;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';
  showCreateForm: boolean = false;

  constructor(private boardService: BoardService) {}

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards(): void {
    this.isLoading = true;
    this.boardService.getBoards(this.page, this.size).subscribe({
      next: (res) => {
        this.boards = res.content || res;
        this.totalPages = res.totalPages || 1;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load boards';
        this.isLoading = false;
      }
    });
  }

  selectBoard(board: Board): void {
    this.selectedBoard = board;
    this.editBoard = { ...board };
  }

  createBoard(): void {
    this.boardService.createBoard(this.newBoard as Board).subscribe({
      next: () => {
        this.newBoard = {};
        this.loadBoards();
      }
    });
  }

  updateBoard(): void {
    if (!this.editBoard.id) return;
    this.boardService.updateBoard(this.editBoard.id, this.editBoard as Board).subscribe({
      next: () => {
        this.selectedBoard = null;
        this.editBoard = {};
        this.loadBoards();
      }
    });
  }

  deleteBoard(id: number): void {
    this.boardService.deleteBoard(id).subscribe({
      next: () => this.loadBoards()
    });
  }

  quickCreateBoard(): void {
    const name = prompt('Board name?');
    if (!name) return;
    const title = prompt('Board title?') || '';
    const description = prompt('Description?') || '';
    const payload: Board = { name, title, description } as any;
    this.boardService.createBoard(payload).subscribe(() => this.loadBoards());
  }

  resetForm(): void {
    this.newBoard = {};
    this.showCreateForm = false;
  }
}
