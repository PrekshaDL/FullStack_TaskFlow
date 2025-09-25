import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLogin {
  isLogin = true;
  passwordVisible = false;
  signupPasswordVisible = false;

  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePassword(event: Event) {
    event.preventDefault();
    this.passwordVisible = !this.passwordVisible;
  }

  toggleSignupPassword(event: Event) {
    event.preventDefault();
    this.signupPasswordVisible = !this.signupPasswordVisible;
  }

  switchToSignup(event: Event) {
    event.preventDefault();
    this.isLogin = false;
  }

  switchToLogin(event: Event) {
    event.preventDefault();
    this.isLogin = true;
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Admin login data:', this.loginForm.value);
      this.router.navigate(['/admin-dashboard']);
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      console.log('Admin signup data:', this.signupForm.value);
      this.router.navigate(['/admin-dashboard']);
    }
  }
}
