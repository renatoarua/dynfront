import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/Rx';

import { StaffService } from './staff.service';
import { ProjectDataService } from './project-data.service';

import { Project, UIElement, Machine, MachineError, Sections, Ribs, Discs, RollerBearings, JournalBearings, Foundations, VES, ABS, ProjectSetting } from '../models/shaft';
import { AppState, AppStatus, ProjectStatus, CollectionState, EditorState, SearchCriteria } from '../store/models';
import { getProjectById, getAllResults, getAppStatus, getCriteria, getCollectionLoaded, getSelectedProject, getProjectStatus, getEditorErrors } from '../store/reducers';
import * as fromActions from '../store/actions';

import { LinkedNode, LinkedList } from '../models/linked-list';

@Injectable()
export class EditorService {
  selectedNode$: Subject<UIElement> = new Subject<UIElement>();

  private _shaft: LinkedList<Sections>;

  constructor(private _store: Store<AppState>,
              private _dataService: ProjectDataService,
              private _staffService: StaffService) {
  }

  get shaft() {
    return this._shaft;
  }

  get criteria(): Observable<SearchCriteria> {
    return this._store.select(getCriteria);
  }

  get appStatus(): Observable<AppStatus> {
    return this._store.select(getAppStatus);
  }

  get hasProjects(): Observable<boolean> {
    return this._store.select(getCollectionLoaded);
  }

  get projects(): Observable<Project[]> {
    return this._store.select(getAllResults);
  }

  get selectedProject(): Observable<Project> {
    return this._store.select(getSelectedProject);
  }

  get projectStatus(): Observable<ProjectStatus> {
    return this._store.select(getProjectStatus);
  }

  get editorErrors(): Observable<MachineError[]> {
    return this._store.select(getEditorErrors);
  }

  loadProjects() {
    // SearchCriteria
    let jwt = this._staffService.getJWTValue();
    let criteria: SearchCriteria = {
      userId: jwt.data.id
    }

    this._store.dispatch(new fromActions.CollectionGetProjects(criteria));
    this._dataService.loadProjects(criteria)
      .map(payload => new fromActions.CollectionGetProjectsSuccess(payload))
      .subscribe((action) => {
        this._store.dispatch(action);
      },
      error => console.log(error));
  }

  saveProject(item: Project) {
    (item.projectId) ? this.updateProject(item) : this.createProject(item);
  }

  createProject(item: Project) {
    this._store.dispatch(new fromActions.CollectionCreateProject());
    this._dataService.createProject(item)
      .map(payload => new fromActions.CollectionCreateProjectSuccess(payload))
      .subscribe((action) => {
        this._store.dispatch(action);
      },
      error => console.log(error));
  }

  updateProject(item: Project) {
    console.log("9a) first event update project");
    this._store.dispatch(new fromActions.CollectionUpdateProject());
    this._dataService.updateProject(item)
      .map(payload => new fromActions.CollectionUpdateProjectSuccess(payload))
      .subscribe((action) => {
        this._store.dispatch(action);
        this._store.dispatch(new fromActions.EditorUpdateMachineFix(action.payload.machine));
      },
      error => console.log(error));
  }

  deleteProject(item: Project) {
    this._store.dispatch(new fromActions.CollectionDeleteProject(item.projectId));
  }

  save(item: Project) {
    // this._store.dispatch(new fromActions.EditorSaveProject());
    this.updateProject(item);
  }

  resetProject() {
    // this._store.dispatch(new fromActions.EditorSelectProjectSuccess(item));
  }

  closeProject() {
    this._store.dispatch(new fromActions.EditorCloseProjectSuccess({}));
  }

  updateMachine(item: Machine) {
    console.log("6) updateMachine first event");
    this._store.dispatch(new fromActions.EditorUpdateMachine(item));
  }

  updateSettings(item: ProjectSetting) {
    // change db
    this._store.dispatch(new fromActions.EditorUpdateSettings(item));
  }

  undo() {
    this._store.dispatch(new fromActions.EditorUndo())
  }

  redo() {
    this._store.dispatch(new fromActions.EditorRedo())
  }

  debugInfo() {
    console.log("succefuly injected");
  }

  validate(project: Project) {
    let errors: MachineError[] = [];
    // check options & check model matching options
    let sys = project.projectsetting.systemoptions;
    let opt = project.projectsetting.resultoptions;

    let res = project.projectsetting;
    let machine = project.machine;

    if(sys['foundation']) {
      if(!machine.foundations || machine.foundations.length < 1)
        errors.push(<MachineError>{ code: 404, message: 'Foundations missing', name:'invalid data' });
    }
    if(sys['rollerbearing']) {
      if(!machine.rollerbearings || machine.rollerbearings.length < 1)
        errors.push(<MachineError>{ code: 404, message: 'Roller Bearings missing', name:'invalid data' });
    }
    if(sys['journalbearing']) {
      if(!machine.journalbearings || machine.journalbearings.length < 1)
        errors.push(<MachineError>{ code: 404, message: 'Journal Bearings missing', name:'invalid data' });
    }
    if(sys['ves']) {
      if(!machine.ves || machine.ves.length < 1)
        errors.push(<MachineError>{ code: 404, message: 'Visco-Elastic Support missing', name:'invalid data' });
    }
    if(sys['abs']) {
      if(!machine.abs || machine.abs.length < 1)
        errors.push(<MachineError>{ code: 404, message: 'ABS missing', name:'invalid data' });
    }

    // result options
    if(opt['campbell']) {
      if(!res.resultcampbell || res.resultcampbell.length < 1)
        errors.push(<MachineError>{ code: 401, message: 'Campbell needs initial setup', name:'invalid result length' });
    }
    if(opt['modes']) {
      if(!res.resultmodes || res.resultmodes.length < 1)
        errors.push(<MachineError>{ code: 401, message: 'Modes needs initial setup', name:'invalid result length' });
    }
    if(opt['criticalMap']) {
      if(!res.resultstiffness || res.resultstiffness.length < 1)
        errors.push(<MachineError>{ code: 401, message: 'Critical Map needs initial setup', name:'invalid result length' });
    }
    if(opt['constantResponse']) {
      if(!res.resultconstant || res.resultconstant.length < 1)
        errors.push(<MachineError>{ code: 401, message: 'Constant Response needs initial setup', name:'invalid result length' });
    }
    if(opt['unbalanceResponse']) {
      if(!res.resultunbalance || res.resultunbalance.length < 1)
        errors.push(<MachineError>{ code: 401, message: 'Unbalance Response needs initial setup', name:'invalid result length' });
    }
    if(opt['torsional']) {
      if(!res.resulttorsional || res.resulttorsional.length < 1)
        errors.push(<MachineError>{ code: 401, message: 'Torsional Analysis needs initial setup', name:'invalid result length' });
    }
    if(opt['timeResponse']) {
      if(!res.resulttime || res.resulttime.length < 1)
        errors.push(<MachineError>{ code: 401, message: 'Time Response needs initial setup', name:'invalid result length' });
    }
    /*if(opt['vesOptimization'] && opt.resultvesopt.length < 1) {
      errors.push({ code: 401, msg: 'VES Optimization needs initial setup' });
    }
    if(opt['absOptimization'] && opt.resultabsopt.length < 1) {
      errors.push({ code: 401, msg: 'ABS Optimization needs initial setup' });
    }
    if(opt['balanceOptimization'] && opt.resultbalanceopt.length < 1) {
      errors.push({ code: 401, msg: 'Balance Optimization needs initial setup' });
    }*/

    // _.isArray(myArray) && myArray.length > 0
    this._store.dispatch(new fromActions.EditorUpdateMachineSuccess(errors));
  }

  selectProject(projectId: string): Observable<boolean> {
    this._store.dispatch(new fromActions.EditorSelectProject(projectId));
    return this._store.select(getProjectById(projectId))
      .map(project => {
        if(project) {
          this._store.dispatch(new fromActions.EditorSelectProjectSuccess(project));
          return true;
        }
        return false;
      })
      .switchMap(() => Observable.of(true))
      .catch(() => Observable.of(false));
  }

  selectNode(node: UIElement) {
    this.selectedNode$.next(node);
  }

  private addUUID(item: Project): Project {
    // Avoiding state mutation FTW!
    return Object.assign({}, item, {id: this.generateUUID(21)});
  }

  private generateUUID(size: number = 21): string {
    let codeAlphabet = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let min = 1;
    let max = codeAlphabet.length; 
    let token = "";

    var byteArray = new Uint8Array(1);
    for (let i = 0; i < size; i++) {
      window.crypto.getRandomValues(byteArray);
      var r = byteArray[0];
      r = Math.floor(r * (max - min + 1)) + min;
      token += codeAlphabet.charAt(r);
    }

    return token;
  }

  public static getMaterials(): Array<any> {
    return [
      {
        label: 'Gold',
        value: '1'
      },
      {
        label: 'Silver',
        value: '2'
      },
      {
        label: 'Brass',
        value: '3'
      },
      {
        label: 'Iron',
        value: '4'
      },
      {
        label: 'Mud',
        value: '5'
      }
    ];
  }
}

