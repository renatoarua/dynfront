import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProjectService } from './services/project.service';

import { Store } from '@ngrx/store';
import { AppState } from './store/models';
import { getAllResults } from './store/reducers';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class CollectionGuard implements CanActivate {

  constructor(private _projectService: ProjectService,
              private _store: Store<AppState>) {

  }

  /**
   * `getFromStoreOrAPI` first checks collection has projects,
   * and if not it then loads from API
   */
  getFromStoreOrAPI(): Observable<any> {
    return this._store.select(getAllResults)
      .do((data: any) => {
        console.log(data.length);
        if (!data.length) {
          this._projectService.loadProjects();
          // this.store.dispatch(new Courses.CoursesGet());
        }
      })
      .filter((data: any) => data.length)
      .take(1);
  }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean> | boolean {
    return this.getFromStoreOrAPI()
      .switchMap(() => of(true))
      .catch(() => of(false));
  }
}