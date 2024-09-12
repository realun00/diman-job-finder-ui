import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-job-delete',
  templateUrl: './job-delete.component.html',
  styleUrls: ['./job-delete.component.scss'],
})
export class JobDeleteComponent {
  @Input() job: any; // Receive job data
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog
  @Input() formName: any; // Receive formName
  @Input() bodyText: any; // Receive job data
  @Input() loading: any;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) {}

  onSubmit(): void {
    this.loading.state = true;
    this.http.patch(`${BASE_URL}/jobs/job/${this.job?.['_id']}/deactivate`, '').subscribe({
      next: () => {
        this.snackbarService.openSnackBar(
          `${this.job.title} has been deactivated successfully!`,
          'Close',
          'success',
          5000
        );

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
          `${response?.error?.message || 'Job deactivation failed. Please try again later.'}`,
          'Close'
        );
      },
    });
  }
}
