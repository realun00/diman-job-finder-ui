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
  selector: 'app-account-update',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.scss'],
})
export class AccountUpdateComponent implements OnInit {
  user: any;
  role: any;
  submitError: string | null = '';
  loading = false;

  http = inject(HttpClient);

  updateAccountForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    firstName: [''],
    lastName: [''],
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
      this.role = user?.roles?.[0];
    });

    if (this.user) {
      this.updateAccountForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        firstName: this.user?.firstName,
        lastName: this.user?.lastName,
      });
    }
  }

  onSubmit(): void {
    if (this.updateAccountForm.invalid) {
      this.submitError = 'Please fill out all required fields.';
      return;
    } else {
      this.submitError = '';
    }

    if (this.updateAccountForm.status === 'VALID') {
      this.loading = true;
      const body = JSON.parse(JSON.stringify(this.updateAccountForm.getRawValue()));

      if (this.role === 'ORGANIZATION') {
        delete body.firstName;
        delete body.lastName;
      }

      this.http.put(`${BASE_URL}/auth/updateUserDetails`, body).subscribe({
        next: (response: any) => {
          this.submitError = '';

          this.snackbarService.openSnackBar('Your account has been updated successfully!', 'Close', 'success');

          setTimeout(() => {
            this.loading = false;
            this.authService.setCurrentUser(response.data);
            this.cdr.detectChanges(); // Manually trigger change detection
          }, 300); // 1000 milliseconds delay
        },
        error: response => {
          this.snackbarService.openSnackBar(
            response?.error?.message || 'Update failed. Please try again later.',
            'Close'
          );

          this.loading = false;
          this.cdr.detectChanges(); // Manually trigger change detection
        },
      });
    }
  }
}
