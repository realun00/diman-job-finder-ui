import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
})
export class ApplicantsComponent implements OnInit {
  http = inject(HttpClient);
  jobs: any;
  user: any;
  role: any;
  loading = true;

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });

    this.http.get(`${BASE_URL}/jobs/job/organization`).subscribe({
      next: request => {
        this.jobs = request;
        this.loading = false;
      },
      error: request => {
        this.snackbarService.openSnackBar(request?.error?.message || 'Unable to fetch data', 'Close');
        this.loading = false;
      },
    });
  }

  trackById(index: number, job: any): string {
    return job['_id']; // Assuming each job has a unique `id` property
  }

  onJobActivated(jobId: string): void {
    this.jobs = this.jobs
      .map((job: any) => (job._id !== jobId ? job : { ...job, isActive: true }))
      .sort((a: any, b: any) => {
        // Assuming 'isActive' is a boolean where true = active, false = deactivated
        return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
      });
  }

  onJobDeactivated(jobId: string): void {
    this.jobs = this.jobs
      .map((job: any) => (job._id !== jobId ? job : { ...job, isActive: false }))
      .sort((a: any, b: any) => {
        // Assuming 'isActive' is a boolean where true = active, false = deactivated
        return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
      });
  }

  // Method to handle the event when a job is edited
  onJobEdited(editedJob: any): void {
    this.jobs = this.jobs.map((job: any) => (job._id === editedJob._id ? editedJob : job));
  }
}
