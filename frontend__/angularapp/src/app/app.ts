import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // <-- Needed for API calls
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class App {
  protected readonly title = signal('angularapp');

  constructor(private router: Router) {}

  showHeader(): boolean {
    const currentUrl = this.router.url;
    return !currentUrl.includes('/user-dashboard') && 
           !currentUrl.includes('/admin-dashboard') &&
           !currentUrl.includes('/admin/') &&
           !currentUrl.includes('/user/');
  }

  isAdminPage(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/admin-landingpage') || 
           currentUrl.includes('/admin-login') ||
           currentUrl.includes('/admin-dashboard') ||
           currentUrl.includes('/admin/');
  }

  getHomeLink(): string {
    return this.isAdminPage() ? '/admin-landingpage' : '/user-landingpage';
  }

  showFooter(): boolean {
    const currentUrl = this.router.url;
    return !currentUrl.includes('/user-dashboard') && 
           !currentUrl.includes('/admin-dashboard') &&
           !currentUrl.includes('/admin/') &&
           !currentUrl.includes('/user/') &&
           !currentUrl.includes('/user-login') &&
           !currentUrl.includes('/admin-login');
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  navigateToHome(): void {
    const homeLink = this.getHomeLink();
    this.router.navigate([homeLink]);
  }

  isCurrentPageHome(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === '/user-landingpage' || currentUrl === '/admin-landingpage';
  }
}
