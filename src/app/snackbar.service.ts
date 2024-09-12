import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root', // This ensures the service is a singleton and available globally
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, type = 'error', duration = 4000) {
    let props = {};
    if (type === 'error') {
      props = {
        duration: duration,
        horizontalPosition: 'right', // Change position: 'start', 'center', 'end', 'left', 'right'
        verticalPosition: 'bottom', // Change position: 'top', 'bottom'
        panelClass: ['error-snackbar'], // Add a custom class to style the snackbar
      };
    } else {
      props = {
        duration: duration,
        horizontalPosition: 'right', // Change position: 'start', 'center', 'end', 'left', 'right'
        verticalPosition: 'bottom', // Change position: 'top', 'bottom'
        panelClass: ['success-snackbar'], // Add a custom class to style the snackbar
      };
    }

    this.snackBar.open(message, action, props);
  }
}
