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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getData().subscribe(user => {
      this.user = user;
    });
  }

  @ViewChild('drawer') drawer!: MatDrawer;

  toggleDrawer() {
    this.drawer.toggle(); // Open/close drawer
  }
}
