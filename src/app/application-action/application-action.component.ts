import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-application-action',
  templateUrl: './application-action.component.html',
  styleUrls: ['./application-action.component.scss'],
})
export class ApplicationActionComponent implements OnInit {
  @Input() job: any; // Receive data
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog
  @Input() formName: any; // Receive formName
  @Input() bodyText: any; // Receive job data
  @Input() loading: any;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  application: any;

  constructor(private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.application = this.job;
  }

  onSubmit(): void {
    this.loading.state = true;
    const body = { status: this.application.updateStatus };

    this.http.patch(`${BASE_URL}/application/application/${this.application?.['_id']}/status`, body).subscribe({
      next: () => {
        this.snackbarService.openSnackBar(
          `${this.application['_id']} status has been changed successfully!`,
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
          `${response?.error?.message || 'Status change failed. Please try again later.'}`,
          'Close'
        );
      },
    });
  }
}
