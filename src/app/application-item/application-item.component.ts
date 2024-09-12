import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BASE_URL } from '../app.contants';
import { SnackbarService } from '../snackbar.service';

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
    private snackbarService: SnackbarService,
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
    this.http.post(`${BASE_URL}/jobs/job/${this.application?.job?.['_id']}/like`, null).subscribe({
      next: (response: any) => {
        this.application.job.isLiked = response.isLiked;
        this.application.job.likes = response.likes;
      },
      error: (response: any) => {
        this.snackbarService.openSnackBar(response?.error?.message || 'Like failed.', 'Close');
        // Revert optimistic update if the server request fails
        this.application.job.isLiked = false;
        this.application.job.likes -= 1;
      },
    });
  }

  unlike(): void {
    this.http.delete(`${BASE_URL}/jobs/job/${this.application?.job?.['_id']}/like`).subscribe({
      next: (response: any) => {
        this.application.job.isLiked = response.isLiked;
        this.application.job.likes = response.likes;
      },
      error: (response: any) => {
        this.snackbarService.openSnackBar(response?.error?.message || 'Unlike failed.', 'Close');
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
