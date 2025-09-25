import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BoardService } from '../../../services/board.service';
import { UserService } from '../../../services/user.service';
import { ProjectService } from '../../../services/project.service';
import { Board } from '../../../models/board.model';
import { User } from '../../../models/user.model';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class BoardComponent implements OnInit {
  boards: Board[] = [];
  currentUser: User | null = null;
  userProjects: Project[] = [];
  isLoading = false;
  errorMessage = '';
  page = 0;
  size = 10;
  totalPages = 0;

  private boardService = inject(BoardService);
  private userService = inject(UserService);
  private projectService = inject(ProjectService);

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.loadUserProjects();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load current user.';
        console.error(err);
        // Fallback to mock data
        this.createMockUser();
      }
    });
  }

  loadUserProjects(): void {
    if (!this.currentUser?.id) return;

    this.projectService.getProjects().subscribe({
      next: (res: { content: Project[]; totalPages: number }) => {
        this.userProjects = res.content.filter((p: Project) => p.owner?.id === this.currentUser?.id);
        this.loadBoards();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load user projects.';
        console.error(err);
        // Fallback to mock data
        this.createMockBoards();
      }
    });
  }

  loadBoards(): void {
    if (this.userProjects.length === 0) {
      this.boards = [];
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.boardService.getBoards(this.page, this.size).subscribe({
      next: (res: { content: Board[]; totalPages: number }) => {
        const projectIds = this.userProjects.map(p => p.id);
        this.boards = res.content.filter((board: Board) => board.project?.id && projectIds.includes(board.project.id));
        this.totalPages = res.totalPages || 1;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load boards.';
        console.error(err);
        this.isLoading = false;
        // Fallback to mock data
        this.createMockBoards();
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadBoards();
  }

  // Board action methods
  viewBoard(board: Board): void {
    console.log('Viewing board:', board);
    // Implement board view logic
  }

  viewBoardDetails(board: Board): void {
    console.log('Viewing board details:', board);
    // Implement board details view logic
  }

  openBoard(board: Board): void {
    console.log('Opening board:', board);
    // Implement board open logic
  }

  // Helper methods for board statistics
  getBoardTaskCount(board: Board): number {
    // Mock implementation - in real app, this would come from the board data
    return Math.floor(Math.random() * 20) + 5;
  }

  getCompletedTaskCount(board: Board): number {
    // Mock implementation - in real app, this would come from the board data
    return Math.floor(Math.random() * 15) + 2;
  }

  getBoardMemberCount(board: Board): number {
    // Mock implementation - in real app, this would come from the board data
    return Math.floor(Math.random() * 8) + 2;
  }

  getBoardProgress(board: Board): number {
    // Mock implementation - in real app, this would be calculated based on task completion
    return Math.floor(Math.random() * 100);
  }

  // Mock data methods for fallback
  createMockUser(): void {
    this.currentUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '***',
      role: 'USER'
    };
    this.createMockBoards();
  }

  createMockBoards(): void {
    this.boards = [
      {
        id: 1,
        name: 'Sprint Planning Board',
        description: 'Board for managing sprint planning tasks and user stories',
        project: { id: 1, name: 'TaskFlow App', description: 'Main TaskFlow application', status: 'IN_PROGRESS' },
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        name: 'Bug Tracking Board',
        description: 'Board for tracking and managing bug reports and fixes',
        project: { id: 1, name: 'TaskFlow App', description: 'Main TaskFlow application', status: 'IN_PROGRESS' },
        createdAt: new Date('2024-01-20')
      },
      {
        id: 3,
        name: 'Feature Development',
        description: 'Board for developing new features and enhancements',
        project: { id: 2, name: 'Mobile App', description: 'Mobile application development', status: 'IN_PROGRESS' },
        createdAt: new Date('2024-02-01')
      },
      {
        id: 4,
        name: 'Design Review Board',
        description: 'Board for reviewing and approving design mockups',
        project: { id: 2, name: 'Mobile App', description: 'Mobile application development', status: 'IN_PROGRESS' },
        createdAt: new Date('2024-02-05')
      }
    ];
    this.totalPages = 1;
    this.isLoading = false;
  }
}
