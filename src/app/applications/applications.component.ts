import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit {
  applications: any;
  loading = true;
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.http.get(`${BASE_URL}/application/my-applications`).subscribe({
      next: request => {
        this.applications = request;
        this.loading = false;
      },
      error: request => {
        this.loading = false;
        this.snackbarService.openSnackBar(request?.error?.message || 'Unable to fetch data', 'Close');
      },
    });
  }

  trackById(index: number, job: any): string {
    return job['_id']; // Assuming each job has a unique `id` property
  }
}
