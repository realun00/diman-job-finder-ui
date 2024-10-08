import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AccountComponent } from './account/account.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DialogComponent } from './dialog/dialog.component';
import { JobApplyComponent } from './job-apply/job-apply.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationItemComponent } from './application-item/application-item.component';
import { JobItemComponent } from './job-item/job-item.component';
import { FavoriteJobsComponent } from './favorite-jobs/favorite-jobs.component';
import { JobDeleteComponent } from './job-delete/job-delete.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { AccountDeleteComponent } from './account-delete/account-delete.component';
import { JobAddComponent } from './job-add/job-add.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AccountUpdateComponent } from './account-update/account-update.component';
import { ApplicantsComponent } from './applicants/applicants.component';
import { ApplicantItemComponent } from './applicant-item/applicant-item.component';
import { JobActivateComponent } from './job-activate/job-activate.component';
import { ApplicantsListComponent } from './applicants-list/applicants-list.component';
import { ApplicantListItemComponent } from './applicant-list-item/applicant-list-item.component';
import { ApplicationActionComponent } from './application-action/application-action.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    JobsComponent,
    AccountComponent,
    JobItemComponent,
    FavoriteJobsComponent,
    DialogComponent,
    JobApplyComponent,
    ApplicationsComponent,
    ApplicationItemComponent,
    JobDeleteComponent,
    JobEditComponent,
    AccountDeleteComponent,
    JobAddComponent,
    ChangePasswordComponent,
    AccountUpdateComponent,
    ApplicantsComponent,
    ApplicantItemComponent,
    JobActivateComponent,
    ApplicantsListComponent,
    ApplicantListItemComponent,
    ApplicationActionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HeaderComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    HttpClientModule,
    MatCardModule,
    MatDialogModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
