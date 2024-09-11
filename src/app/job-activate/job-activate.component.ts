import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-job-activate',
  templateUrl: './job-activate.component.html',
  styleUrls: ['./job-activate.component.scss'],
})
export class JobActivateComponent {
  @Input() job: any; // Receive job data
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog
  @Input() formName: any; // Receive formName
  @Input() bodyText: any; // Receive job data

  // Error message to be displayed after form submission
  submitError: string | null = null;
  submitSuccess = false;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    this.http.patch(`http://localhost:5000/jobs/job/${this.job?.['_id']}/activate`, '').subscribe({
      next: (response: any) => {
        console.log('Job activated successful', response);
        this.submitSuccess = true;

        setTimeout(() => {
          this.submitSuccess = false;
          if (this.dialogRef) {
            this.dialogRef.close('confirm');
          }
        }, 1500); // 1000 milliseconds delay
      },
      error: response => {
        console.error('Error during activation', response?.error?.message);
        this.submitSuccess = false;
        this.submitError = `${response?.error?.message || 'Job activation failed. Please try again later.'}`; // Set error message
      },
    });
  }
}
