import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-application-item',
  templateUrl: './application-item.component.html',
  styleUrls: ['./application-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class ApplicationItemComponent {
  @Input() application: any;
  readonly panelOpenState = signal(false);

  constructor(
    private http: HttpClient,
    public datePipe: DatePipe
  ) {}

  toggleLike(): void {
    if (this.application?.job) {
      // Optimistic UI update
      const wasLiked = this.application.job.isLiked;
      this.application.job.isLiked = !wasLiked;
      this.application.job.likes += this.application.job.isLiked ? 1 : -1;

      if (this.application.job.isLiked) {
        this.like();
      } else {
        this.unlike();
      }
    }
  }

  like(): void {
    this.http.post(`http://localhost:5000/jobs/job/${this.application?.job?.['_id']}/like`, null).subscribe({
      next: (response: any) => {
        console.log('Like successful', response);
        this.application.job.isLiked = response.isLiked;
        this.application.job.likes = response.likes;
      },
      error: (error: any) => {
        console.error('Failed to like application', error);
        // Revert optimistic update if the server request fails
        this.application.job.isLiked = false;
        this.application.job.likes -= 1;
      },
    });
  }

  unlike(): void {
    this.http.delete(`http://localhost:5000/jobs/job/${this.application?.job?.['_id']}/like`).subscribe({
      next: (response: any) => {
        console.log('Unlike successful', response);
        this.application.job.isLiked = response.isLiked;
        this.application.job.likes = response.likes;
      },
      error: (error: any) => {
        console.error('Failed to unlike application', error);
        // Revert optimistic update if the server request fails
        this.application.job.isLiked = true;
        this.application.job.likes += 1;
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'badge-accepted';
      case 'PENDING':
        return 'badge-pending';
      case 'REJECTED':
        return 'badge-rejected';
      case 'INACTIVE':
        return 'inactive-card';
      default:
        return 'badge-default';
    }
  }
}
