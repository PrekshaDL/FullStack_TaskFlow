import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

declare const AOS: any;

@Component({
  selector: 'app-user-landingpage',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './user-landingpage.html',
  styleUrls: ['./user-landingpage.css'],
})
export class UserLandingpage implements OnInit, AfterViewInit {

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
    this.router.navigate(['/user-login']);
  }
}
