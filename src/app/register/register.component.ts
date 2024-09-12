import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { BASE_URL } from '../app.contants';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  // Error message to be displayed after form submission
  submitError: string | null = null;
  submitSuccess = false;
  currentTab = 0;

  // Loader flag
  loading = false;

  http = inject(HttpClient);
  router = inject(Router);

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    firstName: '',
    lastName: '',
    role: ['USER'], // Initialize as an array to avoid issues
  });

  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.submitError = 'Please fill out all required fields.';
      this.submitSuccess = false;
      return;
    } else {
      this.submitError = '';
    }

    if (this.registerForm.status === 'VALID') {
      this.loading = true;
      this.http.post(`${BASE_URL}/auth/registration`, this.registerForm.value).subscribe({
        next: () => {
          this.submitSuccess = true;
          // Set a timeout before navigating
          setTimeout(() => {
            this.loading = false;
            this.submitSuccess = false;
            this.router.navigateByUrl('/login');
          }, 1000);
        },
        error: response => {
          this.loading = false;
          this.submitSuccess = false;
          this.submitError = `${response?.error?.message || 'Registration failed. Please try again later.'}`; // Set error message
        },
      });
    }
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.currentTab = event.index;
    this.resetComponentState();
  }

  // Method to reset the entire component state
  resetComponentState(): void {
    this.registerForm.reset({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: this.currentTab === 0 ? 'USER' : 'ORGANIZATION',
    });
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();

    this.submitError = null;
    this.submitSuccess = false;
  }
}
