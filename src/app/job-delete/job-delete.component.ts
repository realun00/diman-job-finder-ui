import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-job-delete',
  templateUrl: './job-delete.component.html',
  styleUrls: ['./job-delete.component.scss'],
})
export class JobDeleteComponent {
  @Input() job: any; // Receive job data
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog
  @Input() formName: any; // Receive formName

  // Error message to be displayed after form submission
  submitError: string | null = null;
  submitSuccess = false;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    this.http.patch(`http://localhost:5000/jobs/job/${this.job?.['_id']}`, '').subscribe({
      next: (response: any) => {
        console.log('Job delete successful', response);
        this.submitSuccess = true;

        setTimeout(() => {
          this.submitSuccess = false;
          if (this.dialogRef) {
            this.dialogRef.close('confirm');
          }
        }, 1500); // 1000 milliseconds delay
      },
      error: response => {
        console.error('Error during deletion', response?.error?.message);
        this.submitSuccess = false;
        this.submitError = `${response?.error?.message || 'Job deletion failed. Please try again later.'}`; // Set error message
      },
    });
  }
}
