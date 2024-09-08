import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';
//import { AuthGuard } from './auth.guard'; // Import the guard

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'jobs', component: JobsComponent }, // Guarded route
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route to home
  { path: '**', redirectTo: '/home' }, // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
