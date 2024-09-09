import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(this.getUserData());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getUserData(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
  }

  fetchUserDetails(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:5000/auth/userDetails', { headers });
  }

  // Method to get user data
  getData(): Observable<any> {
    const cachedUser = this.currentUserSubject.value;
    if (cachedUser) {
      return of(cachedUser); // Return cached data if available
    }
    return this.fetchUserDetails(); // Fetch from server if not cached
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login');
  }
}
