import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
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
  selector: 'app-job-apply',
  templateUrl: './job-apply.component.html',
  styleUrls: ['./job-apply.component.scss'],
})
export class JobApplyComponent {
  @Input() job: any; // Receive job data
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog
  @Input() formName: any; // Receive formName
  @Input() loading: any; // Receive loading

  // Error message to be displayed after form submission
  submitError: string | null = null;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  jobApplyForm = this.fb.group({
    coverLetter: ['', Validators.required],
  });

  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) {}

  onSubmit(): void {
    if (this.jobApplyForm.invalid) {
      this.submitError = 'Please fill out all required fields.';
      return;
    } else {
      this.submitError = '';
    }

    if (this.jobApplyForm.status === 'VALID') {
      this.loading.state = true;
      this.http.post(`${BASE_URL}/application/apply/${this.job?.['_id']}`, this.jobApplyForm.getRawValue()).subscribe({
        next: () => {
          this.snackbarService.openSnackBar(
            `You applied successfully for ${this.job.title} at ${this.job.authorName}`,
            'Close',
            'success',
            5000
          );

          setTimeout(() => {
            if (this.dialogRef) {
              this.dialogRef.close('confirm');
              this.loading.state = false;
            }
          }, 300);
        },
        error: response => {
          this.loading.state = false;
          this.snackbarService.openSnackBar(
            `${response?.error?.message || 'Job application failed. Please try again later.'}`,
            'Close'
          );
        },
      });
    }
  }
}
