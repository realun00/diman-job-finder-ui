import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule

import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule, RouterModule],
})
export class HeaderComponent {
  @Output() toggleDrawerEvent = new EventEmitter<void>();
  @Output() closeDrawerEvent = new EventEmitter<void>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() user: any;

  constructor(private router: Router) {}

  toggleDrawer(): void {
    this.toggleDrawerEvent.emit();
  }

  closeDrawer(): void {
    this.closeDrawerEvent.emit();
  }

  // Method to handle redirection
  accountBtnAction(): void {
    this.closeDrawer();
    if (this.user) {
      this.router.navigateByUrl('/account');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
