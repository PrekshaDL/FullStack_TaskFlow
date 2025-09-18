import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  signupForm: FormGroup;

  isLogin = true; // ✅ toggle between login/signup
  passwordVisible = false;
  signupPasswordVisible = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword(event: Event): void {
    event.preventDefault();
    this.passwordVisible = !this.passwordVisible;
  }

  toggleSignupPassword(event: Event): void {
    event.preventDefault();
    this.signupPasswordVisible = !this.signupPasswordVisible;
  }

  switchToSignup(event: Event): void {
    event.preventDefault();
    this.isLogin = false;
  }

  switchToLogin(event: Event): void {
    event.preventDefault();
    this.isLogin = true;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login Submitted:', this.loginForm.value);

      // ✅ Navigate to Dashboard on successful login
      this.router.navigate(['/dashboard']);
    }
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      console.log('Signup Submitted:', this.signupForm.value);

      // ✅ Optionally, redirect new users to dashboard after signup
      this.router.navigate(['/dashboard']);
    }
  }
}
