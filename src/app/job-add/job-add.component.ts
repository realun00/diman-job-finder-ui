import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-job-add',
  templateUrl: './job-add.component.html',
  styleUrls: ['./job-add.component.scss'],
})
export class JobAddComponent {
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog
  @Input() formName: any; // Receive formName
  @Input() emitter: any;

  categories: any[] = [
    { value: 'IT', viewValue: 'IT' },
    { value: 'Finance', viewValue: 'Finance' },
    { value: 'Other', viewValue: 'Other' },
  ];

  types: any[] = [
    { value: 'Full-time', viewValue: 'Full-time' },
    { value: 'Part-time', viewValue: 'Part-time' },
    { value: 'Remote', viewValue: 'Remote' },
  ];

  // Error message to be displayed after form submission
  submitError: string | null = null;
  submitSuccess = false;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  jobAddForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    type: ['', Validators.required],
  });

  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    if (this.jobAddForm.invalid) {
      this.submitError = 'Please fill out all required fields.';
      this.submitSuccess = false;
      return;
    } else {
      this.submitError = '';
    }

    if (this.jobAddForm.status === 'VALID') {
      this.http.post(`http://localhost:5000/jobs/add`, this.jobAddForm.getRawValue()).subscribe({
        next: (response: any) => {
          console.log('Job added successfully', response);
          this.submitSuccess = true;

          this.http.get(`http://localhost:5000/jobs/job`).subscribe({
            next: (response: any) => {
              this.emitter(response);

              setTimeout(() => {
                this.submitSuccess = false;
                if (this.dialogRef) {
                  this.dialogRef.close('confirm');
                }
              }, 1500); // 1000 milliseconds delay
            },
            error: response => {
              console.error('Error during retrieving jobs', response?.error?.message);
              this.submitSuccess = false;
              this.submitError = `${response?.error?.message || 'Jobs retrieving failed. Please try again later.'}`; // Set error message
            },
          });
        },
        error: response => {
          console.error('Error during adding', response?.error?.message);
          this.submitSuccess = false;
          this.submitError = `${response?.error?.message || 'Job adding failed. Please try again later.'}`; // Set error message
        },
      });
    }
  }
}
