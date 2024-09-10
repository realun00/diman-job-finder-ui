import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-application-item',
  templateUrl: './application-item.component.html',
  styleUrls: ['./application-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationItemComponent {
  @Input() application: any;
  readonly panelOpenState = signal(false);

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  toggleLike(): void {
    if (this.application) {
      // Optimistic UI update
      const wasLiked = this.application.isLiked;
      this.application.isLiked = !wasLiked;
      this.application.likes += this.application.isLiked ? 1 : -1;

      if (this.application.isLiked) {
        this.like();
      } else {
        this.unlike();
      }
    }
  }

  like(): void {
    this.http.post(`http://localhost:5000/jobs/application/${this.application?.job?.['_id']}/like`, null).subscribe({
      next: (response: any) => {
        console.log('Like successful', response);
        this.application.isLiked = response.isLiked;
        this.application.likes = response.likes;
      },
      error: (error: any) => {
        console.error('Failed to like application', error);
        // Revert optimistic update if the server request fails
        this.application.isLiked = false;
        this.application.likes -= 1;
      },
    });
  }

  unlike(): void {
    this.http.delete(`http://localhost:5000/jobs/application/${this.application?.job?.['_id']}/like`).subscribe({
      next: (response: any) => {
        console.log('Unlike successful', response);
        this.application.isLiked = response.isLiked;
        this.application.likes = response.likes;
      },
      error: (error: any) => {
        console.error('Failed to unlike application', error);
        // Revert optimistic update if the server request fails
        this.application.isLiked = true;
        this.application.likes += 1;
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
      default:
        return 'badge-default';
    }
  }
}
