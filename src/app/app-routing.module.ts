// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicantsComponent } from './applicants/applicants.component';

import { FavoriteJobsComponent } from './favorite-jobs/favorite-jobs.component';
import { AccountComponent } from './account/account.component';

import { AuthGuard } from './guards/auth.guard'; // Import the auth guard
import { GuestGuard } from './guards/guest.guard'; // Import the guest guard
import { UserGuard } from './guards/user-access.guard';
import { OrganizationGuard } from './guards/organization-access.guard';
import { ApplicantsListComponent } from './applicants-list/applicants-list.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] }, // Apply guest guard
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] }, // Apply guest guard
  { path: 'home', component: HomeComponent },
  { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard] }, // Apply auth guard
  { path: 'job/:jobId/applicants', component: ApplicantsListComponent, canActivate: [AuthGuard, OrganizationGuard] },
  { path: 'applications', component: ApplicationsComponent, canActivate: [AuthGuard, UserGuard] }, // Apply auth guard
  { path: 'applicants', component: ApplicantsComponent, canActivate: [AuthGuard, OrganizationGuard] }, // Apply auth guard
  { path: 'favorite-jobs', component: FavoriteJobsComponent, canActivate: [AuthGuard, UserGuard] }, // Apply auth guard
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] }, // Apply auth guard
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
