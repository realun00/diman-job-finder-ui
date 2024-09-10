import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { JobApplyComponent } from '../job-apply/job-apply.component';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss'],
})
export class JobItemComponent {
  @Input() job: any;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

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
    this.http.post(`http://localhost:5000/jobs/job/${this.job['_id']}/like`, null).subscribe({
      next: (response: any) => {
        console.log('Like successful', response);
        this.job.isLiked = response.isLiked;
        this.job.likes = response.likes;
      },
      error: (error: any) => {
        console.error('Failed to like job', error);
        // Revert optimistic update if the server request fails
        this.job.isLiked = false;
        this.job.likes -= 1;
      },
    });
  }

  unlike(): void {
    this.http.delete(`http://localhost:5000/jobs/job/${this.job['_id']}/like`).subscribe({
      next: (response: any) => {
        console.log('Unlike successful', response);
        this.job.isLiked = response.isLiked;
        this.job.likes = response.likes;
      },
      error: (error: any) => {
        console.error('Failed to unlike job', error);
        // Revert optimistic update if the server request fails
        this.job.isLiked = true;
        this.job.likes += 1;
      },
    });
  }

  // Method to open the reusable dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Apply for ${this.job.title} at ${this.job.authorName}`,
        body: JobApplyComponent,
        dialogData: this.job, // Pass job data to dialog
        confirmButtonText: 'Apply',
        cancelButtonText: 'Cancel',
      },
      disableClose: true, // Prevent closing when clicking outside the dialog
      width: '50%', // Set the width of the dialog
    });

    // Handle the result from the dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        console.log('Task was confirmed');
        // Add your logic here, such as sending a task to the backend
      } else {
        console.log('Task was canceled');
      }
    });
  }
}
