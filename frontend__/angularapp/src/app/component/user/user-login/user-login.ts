import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule, // Needed for *ngIf
    ReactiveFormsModule,
    RouterModule // Added for routerLink
  ],
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.css']
})
export class AuthComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;
  isLogin = true; // Controls which form to show
  passwordVisible = false; // Controls password visibility for login
  signupPasswordVisible = false; // Controls password visibility for signup

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]], // Changed from 'email' to 'login' to match template
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required], // Changed from 'name' to 'username' to match template
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Toggle between login and signup forms
  switchToLogin(event: Event) {
    event.preventDefault();
    this.isLogin = true;
  }

  switchToSignup(event: Event) {
    event.preventDefault();
    this.isLogin = false;
  }

  // Toggle password visibility for login form
  togglePassword(event: Event) {
    event.preventDefault();
    this.passwordVisible = !this.passwordVisible;
  }

  // Toggle password visibility for signup form
  toggleSignupPassword(event: Event) {
    event.preventDefault();
    this.signupPasswordVisible = !this.signupPasswordVisible;
  }

  // Handle login form submission
  onLogin() {
      if (this.loginForm.valid) {
        const { login, password } = this.loginForm.value;
        // Dummy credentials
        if (login === 'testuser' && password === 'testpass') {
          this.router.navigate(['/user-dashboard']);
        } else {
          alert('Invalid username or password. Use testuser / testpass');
        }
      }
  }

  // Handle signup form submission
  onSignup() {
    if (this.signupForm.valid) {
      console.log('Signup Data:', this.signupForm.value);
      // Navigate to user dashboard on successful signup
      this.router.navigate(['/user-dashboard']);
    }
  }
}
