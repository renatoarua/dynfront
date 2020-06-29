import { Component } from '@angular/core';

// import { NbSidebarModule, NbLayoutModule, NbSidebarService } from '@nebular/theme';
import { MENU_ITEMS } from '../dashboard/dashboard-menu';

@Component({
  selector: 'app-dashboard',
  templateUrl: './backend-layout.component.html',
})
export class BackendLayoutComponent {

  menu = MENU_ITEMS;
}