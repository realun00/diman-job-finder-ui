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
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
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

  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
  }

  trackById(index: number, job: any): string {
    return job['_id']; // Assuming each job has a unique `id` property
  }
}
