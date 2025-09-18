import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  constructor(private router: Router) {}

  logout(): void {
    // ✅ Clear session (if using localStorage/sessionStorage)
    localStorage.clear();
    sessionStorage.clear();

    // ✅ Redirect back to login page
    this.router.navigate(['/login']);
  }
}
