import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DialogComponent } from '../dialog/dialog.component';
import { JobDeleteComponent } from '../job-delete/job-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-applicant-list-item',
  templateUrl: './applicant-list-item.component.html',
  styleUrls: ['./applicant-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class ApplicantListItemComponent implements OnInit {
  @Input() applicant: any;
  @Output() applicantAccepted = new EventEmitter<string>();
  @Output() applicantRejected = new EventEmitter<string>();

  constructor(
    private http: HttpClient,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  user: any;
  role: any;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });
  }

  accept(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Accept ${this.applicant.username}`,
        body: JobDeleteComponent,
        bodyText: 'Are you sure that you would like to accept this job application?',
        dialogData: this.applicant,
        formName: 'applicationAcceptForm',
        confirmButtonText: 'Accept',
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
        this.applicantRejected.emit(this.applicant._id);
      } else {
        console.log('Task was canceled');
      }
    });
  }

  reject(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Reject ${this.applicant.username}`,
        body: JobDeleteComponent,
        bodyText: 'Are you sure that you would like to reject this job application?',
        dialogData: this.applicant,
        formName: 'applicationRejectForm',
        confirmButtonText: 'Reject',
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
        this.applicantAccepted.emit(this.applicant._id);
      } else {
        console.log('Task was canceled');
      }
    });
  }
}
