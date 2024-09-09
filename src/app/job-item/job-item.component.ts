import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss'],
})
export class JobItemComponent {
  @Input() job: any;

  constructor(private http: HttpClient) {}

  toggleLike(): void {
    if (this.job) {
      // Optimistic UI update
      const wasLiked = this.job.isLiked;
      this.job.isLiked = !wasLiked;
      this.job.likes += this.job.isLiked ? 1 : -1;

      if (this.job.isLiked) {
        this.like();
      } else {
        this.unlike();
      }
    }
  }

  like(): void {
    this.http.post(`http://localhost:5000/jobs/job/${this.job['_id']}/like`, null).subscribe({
      next: (response: any) => {
        console.log('Like successful', response);
        this.job.isLiked = response.isLiked;
        this.job.likes = response.likes;
      },
      error: (error: any) => {
        console.error('Failed to like job', error);
        // Revert optimistic update if the server request fails
        this.job.isLiked = false;
        this.job.likes -= 1;
      },
    });
  }

  unlike(): void {
    this.http.delete(`http://localhost:5000/jobs/job/${this.job['_id']}/like`).subscribe({
      next: (response: any) => {
        console.log('Unlike successful', response);
        this.job.isLiked = response.isLiked;
        this.job.likes = response.likes;
      },
      error: (error: any) => {
        console.error('Failed to unlike job', error);
        // Revert optimistic update if the server request fails
        this.job.isLiked = true;
        this.job.likes += 1;
      },
    });
  }
}
