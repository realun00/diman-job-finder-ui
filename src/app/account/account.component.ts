import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AccountDeleteComponent } from '../account-delete/account-delete.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  user: any;
  role: any;

  deleteLoading = { state: false }; // Object reference in parent

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });
  }

  // Method to open the reusable dialog
  remove(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Delete ${this.user.username}`,
        body: AccountDeleteComponent,
        formName: 'accountDeleteForm',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        dialogData: this.user,
        loading: this.deleteLoading,
      },
      disableClose: true, // Prevent closing when clicking outside the dialog
      panelClass: 'custom-dialog', // Add the custom class here
    });

    // Handle the result from the dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.logout();
      }
    });
  }

  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
    this.user = null;
    this.role = null;
  }
}
