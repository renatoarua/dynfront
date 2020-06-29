import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { takeWhile } from 'rxjs/operators/takeWhile';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { Project, Machine } from '../@core/models/shaft';
import { User } from '../@core/models/user';
import { AppState } from '../@core/store/models';
import { getCollectionLoaded } from '../@core/store/reducers';

import { ProjectService } from '../@core/services/project.service';
import { UserService } from '../@core/services/user.service';
import { GlobalService } from '../@core/services/global.service';
import { SettingDataService } from '../@core/services/setting-data.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {
  alive = true;

  // isLoading and all store statuses here... intercepts the content
  _loading$: Observable<boolean>;
  isLoading = true;

  // get the projects
  _projects: Observable<Array<Project>>;

  // get logged user
  _user: Observable<User>;
  loggedUser: User = null;

  constructor(private themeService: NbThemeService,
              private _projectService: ProjectService,
              private _userService: UserService,
              private _settingDataService: SettingDataService,
              private _globalService: GlobalService,
              private _store: Store<AppState>) {

    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        // this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this._projects = _projectService.projects;

    this._user = _userService.me;
    this._userService.getMe();
    this._user.subscribe((u) => {
      if(u) {
        this.waitForResultsToLoad()
          .subscribe((loaded) => {
            if(!loaded)
              this._projectService.loadProjects();
          });
      }

    });
  }

  waitForResultsToLoad(): Observable<boolean> {
    return this._store.select(getCollectionLoaded)
      .map((loaded) => {
        return loaded;
      });      
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
