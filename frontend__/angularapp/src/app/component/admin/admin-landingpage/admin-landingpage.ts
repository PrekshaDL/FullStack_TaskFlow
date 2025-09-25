import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

declare const AOS: any;

@Component({
  selector: 'app-admin-landing',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-landingpage.html',
  styleUrls: ['./admin-landingpage.css'],
})
export class AdminLandingpage implements OnInit, AfterViewInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }

  ngAfterViewInit() {
    // Refresh AOS after view initialization
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  goToLogin() {
    this.router.navigate(['/admin-login']);
  }
}
