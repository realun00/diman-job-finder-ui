import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.component.html',
  styleUrls: ['./account-delete.component.scss'],
})
export class AccountDeleteComponent implements OnInit {
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog
  @Input() formName: any; // Receive formName
  user: any;

  // Error message to be displayed after form submission
  submitError: string | null = null;
  submitSuccess = false;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onSubmit(): void {
    this.http.delete(`http://localhost:5000/auth/user/${this.user?.['_id']}`).subscribe({
      next: (response: any) => {
        console.log('Account delete successful', response);
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
        this.submitError = `${response?.error?.message || 'Account deletion failed. Please try again later.'}`; // Set error message
      },
    });
  }
}
