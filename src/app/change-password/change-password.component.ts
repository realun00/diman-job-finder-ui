import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../auth.service';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  user: any;
  submitError: string | null = '';
  loading = false;

  http = inject(HttpClient);

  changePasswordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    reNewPassword: ['', Validators.required],
  });

  matcher = new MyErrorStateMatcher();

  private cdr: ChangeDetectorRef; // Inject ChangeDetectorRef

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    cdr: ChangeDetectorRef
  ) {
    this.cdr = cdr;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.submitError = 'Please fill out all required fields.';
      return;
    } else {
      this.submitError = '';
    }

    if (this.changePasswordForm.status === 'VALID') {
      this.loading = true;
      if (this.changePasswordForm.getRawValue().newPassword !== this.changePasswordForm.getRawValue().reNewPassword) {
        this.submitError = "New password and re new password don't match";
        this.loading = false;
        return;
      }

      if (this.changePasswordForm.getRawValue().newPassword === this.changePasswordForm.getRawValue().oldPassword) {
        this.submitError = 'The old and new passwords should be different!';
        this.loading = false;
        return;
      }

      this.http.patch(`${BASE_URL}/auth/changePassword`, this.changePasswordForm.getRawValue()).subscribe({
        next: () => {
          this.submitError = '';

          this.snackbarService.openSnackBar('Your password has been changed successfully!', 'Close', 'success');

          setTimeout(() => {
            this.loading = false;
            this.logout();
          }, 300);

          this.cdr.detectChanges(); // Manually trigger change detection
        },
        error: response => {
          this.snackbarService.openSnackBar(
            response?.error?.message || 'Change password failed. Please try again later.',
            'Close'
          );

          this.loading = false;
          this.cdr.detectChanges(); // Manually trigger change detection
        },
      });
    }
  }

  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
    this.user = null;
  }
}
