// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.currentUser$.pipe(
      map(user => !!user), // Check if user exists
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/login'); // Redirect to login if not authenticated
        }
      })
    );
  }
}
