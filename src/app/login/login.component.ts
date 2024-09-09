import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  // Error message to be displayed after form submission
  submitError: string | null = null;
  submitSuccess = false;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.submitError = 'Please fill out all required fields.';
      this.submitSuccess = false;
      return;
    } else {
      this.submitError = '';
    }

    if (this.loginForm.status === 'VALID') {
      console.log('submitted form', this.loginForm.getRawValue());
      this.http.post('http://localhost:5000/auth/login', this.loginForm.getRawValue()).subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          this.submitSuccess = true;
          localStorage.setItem('token', response?.token);

          // Fetch user details after login
          this.authService.fetchUserDetails().subscribe({
            next: userDetails => {
              console.log('User details fetched', userDetails);
              this.authService.setCurrentUser(userDetails);

              // Navigate after fetching user details
              setTimeout(() => {
                this.submitSuccess = false;
                this.router.navigateByUrl('/');
              }, 1000); // 1000 milliseconds delay
            },
            error: error => {
              console.error('Error fetching user details', error?.error?.message);
              this.submitSuccess = false;
              this.submitError = 'Failed to fetch user details. Please try again later.';
            },
          });
        },
        error: response => {
          console.error('Error during login', response?.error?.message);
          this.submitSuccess = false;
          this.submitError = `${response?.error?.message || 'Login failed. Please try again later.'}`; // Set error message
        },
      });
    }
  }
}
