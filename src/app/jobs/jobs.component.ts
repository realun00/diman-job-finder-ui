import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { DialogComponent } from '../dialog/dialog.component';
import { JobAddComponent } from '../job-add/job-add.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  http = inject(HttpClient);
  jobs: any;
  user: any;
  role: any;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });

    this.http.get('http://localhost:5000/jobs/job').subscribe({
      next: request => {
        console.log('Fetching requests', request);

        this.jobs = request;
      },
      error: request => {
        console.error('Error fetching jobs', request?.error?.message);
      },
    });
  }

  // Method for job edit
  add(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Add job`,
        body: JobAddComponent,
        dialogData: [],
        formName: 'jobAddForm',
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        emitter: this.onJobAdded.bind(this),
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

  trackById(index: number, job: any): string {
    return job['_id']; // Assuming each job has a unique `id` property
  }

  // Method to handle the event when a job is deleted
  onJobDeleted(jobId: string): void {
    // Filter the jobs array to remove the deleted job
    this.jobs = this.jobs.filter((job: any) => job._id !== jobId);
  }

  // Method to handle the event when a job is edited
  onJobEdited(editedJob: any): void {
    this.jobs = this.jobs.map((job: any) => (job._id === editedJob._id ? editedJob : job));
  }

  // Method to handle the event when a job is edited
  onJobAdded(newJobs: any): void {
    this.jobs = newJobs;
  }
}
