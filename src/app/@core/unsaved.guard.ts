import { Injectable } from '@angular/core';
import { Router, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProjectService } from './services/project.service';
import { ProjectDataService } from './services/project-data.service';

import { Store } from '@ngrx/store';
import { AppState, AppStatus } from './store/models';
// import { EditorSelectProjectSuccess, CollectionCreateProjectSuccess } from './store/actions';
// import { getAllResults, getCollectionLoaded, getProjectById, hasSelectedProject } from './store/reducers';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class UnsavedGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(private _projectService: ProjectService,
              private _dataService: ProjectDataService,
              private _router: Router,
              private _store: Store<AppState>) {

  }

  canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    //console.log('Url: '+ url);
    return true;
    // return component.canDeactivate ? component.canDeactivate() : true;
  }
}