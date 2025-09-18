import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User {
  userForm: FormGroup;
  users: any[] = [];
  editing: boolean = false;
  editIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;

      if (this.editing && this.editIndex !== null) {
        this.users[this.editIndex] = { id: this.users[this.editIndex].id, ...newUser };
        this.editing = false;
        this.editIndex = null;
      } else {
        this.users.push({ id: this.users.length + 1, ...newUser });
      }

      this.userForm.reset({ role: 'USER' });
    }
  }

  editUser(user: any) {
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role
    });
    this.editing = true;
    this.editIndex = this.users.indexOf(user);
  }

  deleteUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
  }
}
