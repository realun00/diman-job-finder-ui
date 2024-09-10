import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
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
  selector: 'app-job-apply',
  templateUrl: './job-apply.component.html',
  styleUrls: ['./job-apply.component.scss'],
})
export class JobApplyComponent {
  @Input() job: any; // Receive job data
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog

  // Error message to be displayed after form submission
  submitError: string | null = null;
  submitSuccess = false;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  jobApplyForm = this.fb.group({
    coverLetter: ['', Validators.required],
  });

  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    if (this.jobApplyForm.invalid) {
      this.submitError = 'Please fill out all required fields.';
      this.submitSuccess = false;
      return;
    } else {
      this.submitError = '';
    }

    if (this.jobApplyForm.status === 'VALID') {
      console.log('submitted form', this.jobApplyForm.getRawValue());
      this.http
        .post(`http://localhost:5000/application/apply/${this.job?.['_id']}`, this.jobApplyForm.getRawValue())
        .subscribe({
          next: (response: any) => {
            console.log('Job apply successful', response);
            this.submitSuccess = true;

            setTimeout(() => {
              this.submitSuccess = false;
              if (this.dialogRef) {
                this.dialogRef.close('confirm');
              }
            }, 1500); // 1000 milliseconds delay
          },
          error: response => {
            console.error('Error during applying', response?.error?.message);
            this.submitSuccess = false;
            this.submitError = `${response?.error?.message || 'Job application failed. Please try again later.'}`; // Set error message
          },
        });
    }
  }
}
