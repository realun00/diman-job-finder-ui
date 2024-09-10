// guest.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.currentUser$.pipe(
      map(user => !user), // Check if user does not exist
      tap(isGuest => {
        if (!isGuest) {
          this.router.navigateByUrl('/home'); // Redirect to home if already authenticated
        }
      })
    );
  }
}
