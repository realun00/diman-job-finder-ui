import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
})
export class HeaderComponent {
  @Output() toggleDrawerEvent = new EventEmitter<void>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() user: any;

  toggleDrawer(): void {
    this.toggleDrawerEvent.emit();
    console.log(this.user);
  }
}
