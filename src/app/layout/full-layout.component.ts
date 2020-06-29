import { Component, OnInit } from '@angular/core';

import { StaffService } from '../@core/services/staff.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
  public userData: any = {};
  public today: Date;
  public menuOpen: boolean = false;

  constructor(public staffService: StaffService) {
    this.today = new Date();
  }
  
  ngOnInit(): void {
    const jwtValue: any = this.staffService.getJWTValue();
    if (jwtValue !== null) {
      this.userData = jwtValue.data;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  // (onToggle)="toggled($event)"
}
