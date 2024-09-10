import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../auth.service';

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
  // Error message to be displayed after form submission
  submitError: string | null = '';
  submitSuccess = false;

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
      this.submitSuccess = false;
      return;
    } else {
      this.submitError = '';
    }

    if (this.changePasswordForm.status === 'VALID') {
      if (this.changePasswordForm.getRawValue().newPassword !== this.changePasswordForm.getRawValue().reNewPassword) {
        this.submitError = "New password and re new password don't match";
        return;
      }

      if (this.changePasswordForm.getRawValue().newPassword === this.changePasswordForm.getRawValue().oldPassword) {
        this.submitError = 'The old and new passwords should be different!';
        return;
      }

      this.http.patch(`http://localhost:5000/auth/changePassword`, this.changePasswordForm.getRawValue()).subscribe({
        next: (response: any) => {
          console.log('Password changed successfully', response);
          this.submitSuccess = true;
          this.submitError = '';
          this.cdr.detectChanges(); // Manually trigger change detection

          // Navigate after fetching user details
          setTimeout(() => {
            this.submitSuccess = false;
            this.logout();
          }, 1500); // 1000 milliseconds delay
        },
        error: response => {
          console.error('Error during changing password', response?.error?.message);
          this.submitSuccess = false;
          this.submitError = `${response?.error?.message || 'Change password failed. Please try again later.'}`; // Set error message
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
