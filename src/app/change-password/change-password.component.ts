import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  handleChangePassword() {
    if (this.changePasswordForm.invalid) return;

    const { oldPassword, newPassword } = this.changePasswordForm.value;
    const email = this.authService.email;

    this.authService.changePassword(email, oldPassword, newPassword).subscribe({
      next: (response) => {
        alert(response.message || 'Password changed successfully!');
        this.router.navigateByUrl('/admin');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to change password: ' + (err.error?.error || err.message));
      }
    });
  }
}
