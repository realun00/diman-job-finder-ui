import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-applicants-list',
  templateUrl: './applicants-list.component.html',
  styleUrls: ['./applicants-list.component.scss'],
})
export class ApplicantsListComponent implements OnInit {
  jobId: string | null = null;
  applicants: any = [];
  user: any;
  role: any;
  job: any;

  // Loader flag
  loading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Set loading to true while fetching data
    this.loading = true;

    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });

    this.jobId = this.route.snapshot.paramMap.get('jobId');

    // Fetch job details
    this.http.get(`${BASE_URL}/jobs/job/${this.jobId}`).subscribe({
      next: request => {
        this.job = request;
      },
      error: request => {
        this.router.navigate(['/applicants']);
        this.snackbarService.openSnackBar(`${request?.error?.message || 'Error fetching job details'}`, 'Close');

        this.loading = false; // Stop the loader in case of error
      },
    });

    // Fetch applicants
    this.http.get(`${BASE_URL}/application/applicants/${this.jobId}`).subscribe({
      next: request => {
        this.applicants = request;
        this.loading = false; // Data loaded, stop the loader
      },
      error: request => {
        this.router.navigate(['/applicants']);
        this.snackbarService.openSnackBar(`${request?.error?.message || 'Error fetching applicants'}`, 'Close');
        this.loading = false; // Stop the loader in case of error
      },
    });
  }

  trackById(index: number, applicant: any): string {
    return applicant['_id'];
  }

  onApplicantAccepted(applicationId: string): void {
    this.applicants = this.applicants
      .map((application: any) =>
        application._id !== applicationId ? application : { ...application, status: 'ACCEPTED' }
      )
      .sort((a: any, b: any) => (a.status === b.status ? 0 : a.status ? -1 : 1));
  }

  onApplicantRejected(applicationId: string): void {
    this.applicants = this.applicants
      .map((application: any) =>
        application._id !== applicationId ? application : { ...application, status: 'REJECTED' }
      )
      .sort((a: any, b: any) => (a.status === b.status ? 0 : a.status ? -1 : 1));
  }

  goToApplicants(): void {
    this.router.navigate([`/applicants`]);
  }
}
