import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { DialogComponent } from '../dialog/dialog.component';
import { JobAddComponent } from '../job-add/job-add.component';
import { MatDialog } from '@angular/material/dialog';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

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
  // Loader flag
  loading = true;
  addLoading = { state: false };

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });

    this.http.get(`${BASE_URL}/jobs/job`).subscribe({
      next: request => {
        this.jobs = request;
        this.loading = false;
      },
      error: request => {
        console.error('Error fetching jobs', request?.error?.message);
        this.snackbarService.openSnackBar(request?.error?.message || 'Unable to fetch data', 'Close');
        this.loading = false;
      },
    });
  }

  // Method for job edit
  add(): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Add job`,
        body: JobAddComponent,
        dialogData: [],
        formName: 'jobAddForm',
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        emitter: this.onJobAdded.bind(this),
        loading: this.addLoading,
      },
      disableClose: true, // Prevent closing when clicking outside the dialog
      panelClass: 'custom-dialog', // Add the custom class here
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
