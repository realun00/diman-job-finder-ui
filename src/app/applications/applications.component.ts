import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit {
  applications: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5000/application/my-applications').subscribe({
      next: request => {
        console.log('Fetching requests', request);

        this.applications = request;
      },
      error: request => {
        console.error('Error fetching jobs', request?.error?.message);
      },
    });
  }

  trackById(index: number, job: any): string {
    return job['_id']; // Assuming each job has a unique `id` property
  }
}
