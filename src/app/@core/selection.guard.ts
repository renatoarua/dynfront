import { Injectable } from '@angular/core';
import { Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProjectService } from './services/project.service';
import { ProjectDataService } from './services/project-data.service';

import { Store } from '@ngrx/store';
import { AppState, AppStatus } from './store/models';
import { EditorSelectProjectSuccess, CollectionCreateProjectSuccess } from './store/actions';
import { getAllResults, getCollectionLoaded, getProjectById, hasSelectedProject } from './store/reducers';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';

@Injectable()
export class SelectionGuard implements CanActivateChild {

  constructor(private _projectService: ProjectService,
              private _dataService: ProjectDataService,
              private _router: Router,
              private _store: Store<AppState>) {

  }

  /**
   * This method creates an observable that waits for the `status` property
   * of the editor state to turn `ready`, emitting one time once loading
   * has finished.
   */
  waitForResultsToLoad(): Observable<boolean> {
    const loaded$ = this._store.select(getCollectionLoaded);
    const selected$ = this._store.select(hasSelectedProject);
    return Observable.combineLatest(loaded$, selected$, (loaded, selected) => {
      // console.log("loaded "+loaded, "selected "+selected);
      return loaded && selected;
    })
      .take(1);
  }

  selectProject(action: EditorSelectProjectSuccess) {
    this._store.dispatch(action);
  }

  /**
   * This method checks if a project with the given ID is already registered
   * in the Store Collection
   */
  hasProjectInStore(id: string): Observable<boolean> {
    // console.log("check the store for the project: ", id);
    return this._store.select(getProjectById(id))
      .map(project => {
        if(project) {
          this.selectProject(new EditorSelectProjectSuccess(project));
          // console.log('hasProjectInStore');
          return true;
        }
        return false;
      })
      .take(1)
      .catch(() => of(false));
  }

  /**
   * This method loads a project with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasProjectInApi(id: string): Observable<boolean> {
    // console.log("hasProjectInApi", id);
    return this._dataService.getProjectById(id)
      .map(project => new CollectionCreateProjectSuccess(project))
      .do((action: CollectionCreateProjectSuccess) => this._store.dispatch(action))
      .map(action => {
        if(action) {
          this.selectProject(new EditorSelectProjectSuccess(action.payload));
          // console.log('hasProjectInApi');
        }

        return !!action;
      })
      .catch(() => {
        this._router.navigate(['/404']);
        return of(false);
      });
  }

  /**
   * `hasProject` composes `hasProjectInStore` and `hasProjectInApi`. It first checks
   * if the book is in store, and if not it then checks if it is in the
   * API.
   */
  hasProject(id: string): Observable<boolean> {
    return this.hasProjectInStore(id)
      .switchMap(inStore => {
        if(inStore) {
          return of(inStore);
        }
        // check api
        // console.log("checking API");
        // return this.hasProjectInApi(id);
      });
  }

  getFromStoreOrAPI(id:string): Observable<boolean> {
    return this._store.select(getCollectionLoaded)
      .map(loaded => loaded)
      .do(loaded => {
        if(!loaded)
          this._projectService.loadProjects();
      })
      .filter((data: any) => data)
      .take(1)
      .switchMap(() => this.hasProject(id));
  }

  canActivateChild(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean> | boolean {
    // console.log("wait for projects loaded and project selected");
    return this.waitForResultsToLoad()
      .switchMap(() => this.getFromStoreOrAPI(route.paramMap.get('projectId')));
  }
}