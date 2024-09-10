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
  selector: 'app-account-update',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.scss'],
})
export class AccountUpdateComponent implements OnInit {
  user: any;
  role: any;
  // Error message to be displayed after form submission
  submitError: string | null = '';
  submitSuccess = false;

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
    cdr: ChangeDetectorRef
  ) {
    this.cdr = cdr;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user.roles[0];
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
      this.submitSuccess = false;
      return;
    } else {
      this.submitError = '';
    }

    if (this.updateAccountForm.status === 'VALID') {
      const body = JSON.parse(JSON.stringify(this.updateAccountForm.getRawValue()));

      if (this.role === 'ORGANIZATION') {
        delete body.firstName;
        delete body.lastName;
      }

      this.http.put(`http://localhost:5000/auth/updateUserDetails`, body).subscribe({
        next: (response: any) => {
          console.log('Account updated successfully', response);
          this.submitSuccess = true;
          this.submitError = '';

          setTimeout(() => {
            this.authService.setCurrentUser(response.data);
            this.cdr.detectChanges(); // Manually trigger change detection
          }, 1500); // 1000 milliseconds delay

          this.cdr.detectChanges(); // Manually trigger change detection
        },
        error: response => {
          console.error('Error during updating', response?.error?.message);
          this.submitSuccess = false;
          this.submitError = `${response?.error?.message || 'Update failed. Please try again later.'}`; // Set error message
          this.cdr.detectChanges(); // Manually trigger change detection
        },
      });
    }
  }
}
