import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

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
    this.http.get(`http://localhost:5000/jobs/job/${this.jobId}`).subscribe({
      next: request => {
        console.log('Fetching job', request);
        this.job = request;
      },
      error: request => {
        this.router.navigate(['/applicants']);
        console.error('Error fetching job details', request?.error?.message);
        this.loading = false; // Stop the loader in case of error
      },
    });

    // Fetch applicants
    this.http.get(`http://localhost:5000/application/applicants/${this.jobId}`).subscribe({
      next: request => {
        console.log('Fetching applicants', request);
        this.applicants = request;
        this.loading = false; // Data loaded, stop the loader
      },
      error: request => {
        this.router.navigate(['/applicants']);
        console.error('Error fetching applicants', request?.error?.message);
        this.loading = false; // Stop the loader in case of error
      },
    });
  }

  trackById(index: number, applicant: any): string {
    return applicant['_id'];
  }

  onApplicantAccepted(jobId: string): void {
    this.applicants = this.applicants
      .map((job: any) => (job._id !== jobId ? job : { ...job, status: 'ACCEPTED' }))
      .sort((a: any, b: any) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
  }

  onApplicantRejected(jobId: string): void {
    this.applicants = this.applicants
      .map((job: any) => (job._id !== jobId ? job : { ...job, status: 'REJECTED' }))
      .sort((a: any, b: any) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
  }
}
