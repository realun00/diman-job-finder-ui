import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'job-finder-diman';
  user: any;
  role: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.role = user?.roles[0];
    });
  }

  @ViewChild('drawer') drawer!: MatDrawer;

  toggleDrawer() {
    this.drawer.toggle(); // Open/close drawer
  }

  closeDrawer() {
    this.drawer.close(); // close drawer
  }

  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
    this.user = null;
    this.role = null;
  }
}
