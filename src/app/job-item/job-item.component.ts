import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { JobApplyComponent } from '../job-apply/job-apply.component';
import { AuthService } from '../auth.service';
import { JobDeleteComponent } from '../job-delete/job-delete.component';
import { JobEditComponent } from '../job-edit/job-edit.component';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss'],
})
export class JobItemComponent implements OnInit {
  @Input() job: any;
  @Output() jobDeleted = new EventEmitter<string>(); // Emit job ID when deleted
  @Output() jobEdited = new EventEmitter<string>(); // Emit job ID when edited

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {}

  user: any;
  role: any;

  applyLoading = { state: false };
  editLoading = { state: false };
  removeLoading = { state: false };

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });
  }

  toggleLike(): void {
    if (this.job) {
      // Optimistic UI update
      const wasLiked = this.job.isLiked;
      this.job.isLiked = !wasLiked;
      this.job.likes += this.job.isLiked ? 1 : -1;

      if (this.job.isLiked) {
        this.like();
      } else {
        this.unlike();
      }
    }
  }

  like(): void {
    this.http.post(`${BASE_URL}/jobs/job/${this.job['_id']}/like`, null).subscribe({
      next: (response: any) => {
        this.job.isLiked = response.isLiked;
        this.job.likes = response.likes;
      },
      error: (response: any) => {
        this.snackbarService.openSnackBar(response?.error?.message || 'Like failed.', 'Close');
        // Revert optimistic update if the server request fails
        this.job.isLiked = false;
        this.job.likes -= 1;
      },
    });
  }

  unlike(): void {
    this.http.delete(`${BASE_URL}/jobs/job/${this.job['_id']}/like`).subscribe({
      next: (response: any) => {
        this.job.isLiked = response.isLiked;
        this.job.likes = response.likes;
      },
      error: (response: any) => {
        this.snackbarService.openSnackBar(response?.error?.message || 'Unlike failed.', 'Close');
        // Revert optimistic update if the server request fails
        this.job.isLiked = true;
        this.job.likes += 1;
      },
    });
  }

  // Method apply for job
  apply(): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Apply for ${this.job.title} at ${this.job.authorName}`,
        body: JobApplyComponent,
        dialogData: this.job, // Pass job data to dialog
        formName: 'jobApplyForm',
        confirmButtonText: 'Apply',
        cancelButtonText: 'Cancel',
        loading: this.applyLoading,
      },
      disableClose: true, // Prevent closing when clicking outside the dialog
      width: '50%', // Set the width of the dialog
    });
  }

  // Method for job edit
  edit(): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Edit ${this.job.title}`,
        body: JobEditComponent,
        dialogData: this.job, // Pass job data to dialog
        formName: 'jobEditForm',
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        emitter: this.jobEdited,
        loading: this.editLoading,
      },
      disableClose: true, // Prevent closing when clicking outside the dialog
      width: '50%', // Set the width of the dialog
    });
  }

  // Method to open the reusable dialog
  remove(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Delete ${this.job.title}`,
        body: JobDeleteComponent,
        dialogData: this.job, // Pass job data to dialog
        formName: 'jobDeleteForm',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        loading: this.removeLoading,
      },
      disableClose: true, // Prevent closing when clicking outside the dialog
      width: '50%', // Set the width of the dialog
    });

    // Handle the result from the dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        // Emit the job's ID to the parent
        this.jobDeleted.emit(this.job._id);
      }
    });
  }
}
