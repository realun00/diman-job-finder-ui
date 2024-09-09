// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';
import { FavoriteJobsComponent } from './favorite-jobs/favorite-jobs.component';
import { AccountComponent } from './account/account.component';

import { AuthGuard } from './auth.guard'; // Import the auth guard
import { GuestGuard } from './guest.guard'; // Import the guest guard

const routes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] }, // Apply guest guard
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] }, // Apply guest guard
  { path: 'home', component: HomeComponent },
  { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard] }, // Apply auth guard
  { path: 'favorite-jobs', component: FavoriteJobsComponent, canActivate: [AuthGuard] }, // Apply auth guard
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] }, // Apply auth guard
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
