import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss'],
})
export class JobEditComponent implements OnInit {
  @Input() job: any; // Receive job data
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog
  @Input() formName: any; // Receive formName
  @Input() loading: any;

  @Output() emitter = new EventEmitter<any>(); // Emit the updated job data

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

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  jobEditForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    type: ['', Validators.required],
  });

  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Initialize the form with job data after the component is initialized
    if (this.job) {
      this.jobEditForm.patchValue({
        title: this.job.title,
        description: this.job.description,
        category: this.job?.category,
        type: this.job?.type,
      });
    }
  }

  onSubmit(): void {
    if (!this.jobEditForm.dirty) {
      if (this.dialogRef) {
        this.dialogRef.close('confirm');
      }
      return;
    }
    if (this.jobEditForm.invalid) {
      this.submitError = 'Please fill out all required fields.';
      return;
    } else {
      this.submitError = '';
    }

    if (this.jobEditForm.status === 'VALID') {
      this.loading.state = true;
      this.http.put(`${BASE_URL}/jobs/job/${this.job?.['_id']}`, this.jobEditForm.getRawValue()).subscribe({
        next: () => {
          this.snackbarService.openSnackBar(
            `${this.job.title} has been edited successfully!`,
            'Close',
            'success',
            5000
          );

          // Emit the updated job data after a successful response
          this.emitter.emit({ ...this.job, ...this.jobEditForm.getRawValue() });

          setTimeout(() => {
            this.loading.state = false;
            if (this.dialogRef) {
              this.dialogRef.close('confirm');
            }
          }, 300);
        },
        error: response => {
          this.loading.state = false;
          this.snackbarService.openSnackBar(
            `${response?.error?.message || 'Job editing failed. Please try again later.'}`,
            'Close'
          );
        },
      });
    }
  }
}
