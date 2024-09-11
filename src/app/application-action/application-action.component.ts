import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';

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

  // Error message to be displayed after form submission
  submitError: string | null = null;
  submitSuccess = false;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  application: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.application = this.job;
  }

  onSubmit(): void {
    const body = { status: this.application.updateStatus };

    this.http
      .patch(`http://localhost:5000/application/application/${this.application?.['_id']}/status`, body)
      .subscribe({
        next: (response: any) => {
          console.log('Status changed successfully', response);
          this.submitSuccess = true;

          setTimeout(() => {
            this.submitSuccess = false;
            if (this.dialogRef) {
              this.dialogRef.close('confirm');
            }
          }, 1500); // 1000 milliseconds delay
        },
        error: response => {
          console.error('Error during status change', response?.error?.message);
          this.submitSuccess = false;
          this.submitError = `${response?.error?.message || 'Status change failed. Please try again later.'}`; // Set error message
        },
      });
  }
}
