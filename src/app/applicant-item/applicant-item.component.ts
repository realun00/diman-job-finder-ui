import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DialogComponent } from '../dialog/dialog.component';
import { JobDeleteComponent } from '../job-delete/job-delete.component';
import { JobEditComponent } from '../job-edit/job-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { JobActivateComponent } from '../job-activate/job-activate.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applicant-item',
  templateUrl: './applicant-item.component.html',
  styleUrls: ['./applicant-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class ApplicantItemComponent implements OnInit {
  @Input() job: any;
  @Output() jobActivated = new EventEmitter<string>(); // Emit job ID when activated
  @Output() jobDeactivated = new EventEmitter<string>(); // Emit job ID when deactivated
  @Output() jobEdited = new EventEmitter<string>(); // Emit job ID when edited
  readonly panelOpenState = signal(false);

  constructor(
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  user: any;
  role: any;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });
  }

  // Method for job edit
  edit(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Edit ${this.job.title}`,
        body: JobEditComponent,
        dialogData: this.job, // Pass job data to dialog
        formName: 'jobEditForm',
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        emitter: this.jobEdited,
      },
      disableClose: true, // Prevent closing when clicking outside the dialog
      width: '50%', // Set the width of the dialog
    });

    // Handle the result from the dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        console.log('Task was confirmed');
        // Add your logic here, such as sending a task to the backend
      } else {
        console.log('Task was canceled');
      }
    });
  }

  deactivate(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Deactivate ${this.job.title}`,
        body: JobDeleteComponent,
        bodyText: 'Are you sure that you would like to deactivate this job?',
        dialogData: this.job, // Pass job data to dialog
        formName: 'jobDeactivateForm',
        confirmButtonText: 'Deactivate',
        cancelButtonText: 'Cancel',
      },
      disableClose: true, // Prevent closing when clicking outside the dialog
      width: '50%', // Set the width of the dialog
    });

    // Handle the result from the dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        console.log('Task was confirmed');
        // Emit the job's ID to the parent
        this.jobDeactivated.emit(this.job._id);
      } else {
        console.log('Task was canceled');
      }
    });
  }

  activate(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Activate ${this.job.title}`,
        body: JobActivateComponent,
        dialogData: this.job, // Pass job data to dialog
        formName: 'jobActivateForm',
        confirmButtonText: 'Activate',
        cancelButtonText: 'Cancel',
      },
      disableClose: true, // Prevent closing when clicking outside the dialog
      width: '50%', // Set the width of the dialog
    });

    // Handle the result from the dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        console.log('Task was confirmed');
        // Emit the job's ID to the parent
        this.jobActivated.emit(this.job._id);
      } else {
        console.log('Task was canceled');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'badge-owned';
      case 'INACTIVE':
        return 'badge-rejected';
      default:
        return 'badge-default';
    }
  }

  goToApplicantsList(jobId: string): void {
    this.router.navigate([`/job/${jobId}/applicants`]);
  }
}
