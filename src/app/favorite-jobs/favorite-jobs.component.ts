import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-favorite-jobs',
  templateUrl: './favorite-jobs.component.html',
  styleUrls: ['./favorite-jobs.component.scss'],
})
export class FavoriteJobsComponent implements OnInit {
  http = inject(HttpClient);
  jobs: any;
  loading = true;

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.http.get(`${BASE_URL}/jobs/favorites`).subscribe({
      next: request => {
        this.loading = false;

        this.jobs = request;
      },
      error: request => {
        this.loading = false;
        this.snackbarService.openSnackBar(request?.error?.message || 'Unable to fetch data', 'Close');
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
