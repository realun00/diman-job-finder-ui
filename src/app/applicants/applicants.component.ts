import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });

    this.http.get('http://localhost:5000/jobs/job/organization').subscribe({
      next: request => {
        console.log('Fetching requests', request);

        this.jobs = request;
      },
      error: request => {
        console.error('Error fetching jobs', request?.error?.message);
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
