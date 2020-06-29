import { Component } from '@angular/core';
// import { NbMenuComponent } from '@nebular/theme';

import { MENU_ITEMS } from '../rotordyn/rotordyn-menu';

@Component({
  selector: 'app-dashboard',
  templateUrl: './clean-layout.component.html',
})
export class CleanLayoutComponent {
  menu = MENU_ITEMS;
}
