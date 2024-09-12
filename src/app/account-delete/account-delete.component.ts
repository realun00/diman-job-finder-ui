import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.component.html',
  styleUrls: ['./account-delete.component.scss'],
})
export class AccountDeleteComponent implements OnInit {
  @Input() dialogRef: MatDialogRef<any> | null = null; // Dialog reference to close the dialog
  @Input() formName: any; // Receive formName
  @Input() loading: any; // Receive loading

  user: any;

  submitError: string | null = null;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef); // Inject ChangeDetectorRef

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onSubmit(): void {
    this.loading.state = true; // Update loading state
    this.http.delete(`${BASE_URL}/auth/user/${this.user?.['_id']}`).subscribe({
      next: () => {
        this.snackbarService.openSnackBar(`${this.user.username} has been deleted successfully!`, 'Close', 'success');

        setTimeout(() => {
          if (this.dialogRef) {
            this.dialogRef.close('confirm');
            this.loading.state = false; // Update loading state
          }
        }, 300); // 1000 milliseconds delay
      },
      error: () => {
        this.loading.state = false; // Update loading state
        this.snackbarService.openSnackBar('Account deletion failed. Please try again later.', 'Close');
      },
    });
  }
}
