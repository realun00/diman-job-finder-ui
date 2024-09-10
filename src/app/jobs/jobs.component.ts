import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(private authService: AuthService) {}

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
}
