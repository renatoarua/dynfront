import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NbMenuService, NbSidebarService } from '@nebular/theme';
// import { UserService } from '../../../@core/data/users.service';
// import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { StaffService } from '../../../@core/services/staff.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() position = 'normal';
  @Input() editor = false;

  user: any;
  userMenu = [{ title: 'Account' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private staffService: StaffService,
              private _router:Router) {
  }

  ngOnInit() {
    let self = this;
    self.sidebarService.toggle(false, 'menu-sidebar');
    const jwtValue: any = self.staffService.getJWTValue();
    if (jwtValue !== null) {
      self.user = jwtValue.data;
    }

    self.menuService.onItemClick()
      .pipe(
        filter(({tag}) => tag === 'user-context-menu'),
        map(({item:{title}}) => title),
      )
      .subscribe(title => {
        if(title === 'Log out')
          self.logout();
        else if (title === 'Account')
          self.goToProfile();
      });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  logout() {
    this._router.navigate(['/auth/logout']);
  }

  goToHome() {
    // this.menuService.navigateHome();
    this._router.navigate(['/dashboard']);
  }

  goToProfile() {
    this._router.navigate(['/account']);
  }

  startSearch() {
    // this.analyticsService.trackEvent('startSearch');
  }
}
