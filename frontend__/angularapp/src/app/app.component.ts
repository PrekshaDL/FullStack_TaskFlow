import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}

  showHeader(): boolean {
    const currentUrl = this.router.url;
    return !currentUrl.includes('/user-dashboard') && 
           !currentUrl.includes('/admin-dashboard') &&
           !currentUrl.includes('/admin/') &&
           !currentUrl.includes('/user/');
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

  navigateToHome(): void {
    const homeLink = this.getHomeLink();
    this.router.navigate([homeLink]);
  }

  isCurrentPageHome(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === '/user-landingpage' || currentUrl === '/admin-landingpage';
  }
}
