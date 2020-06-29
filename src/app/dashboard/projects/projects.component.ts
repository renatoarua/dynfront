import { Component, ViewChild, OnInit, OnDestroy, TemplateRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

import { Router } from "@angular/router";
import { StaffService } from "../../@core/services/staff.service";
import { ProjectService } from '../../@core/services/project.service';
import { ProjectDataService } from '../../@core/services/project-data.service';
import { Observable } from 'rxjs/Observable';

import { Project, Machine } from '../../@core/models/shaft';
import { Store } from '@ngrx/store';
import { AppState } from '../../@core/store/models';

import { ModalItem } from '../../components/modal-item';
import { DynModalComponent } from '../../components/dyn-modal.component';
import { NewProjectComponent } from '../new-project.component';

@Component({
  selector: 'ngx-projects',
  styleUrls: ['./projects.component.scss'],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @ViewChild(DynModalComponent) modals: DynModalComponent;
  // private _projects: Observable<Array<Project>>;

  @Input() projects: Array<Project>;

  public _form:FormGroup;
  public _formErrors:any;
  public _submitted:boolean = false;
  public _newProject:Project;
  public _errorMessage:string;

  list: ModalItem[] = [];

  // System entry options
  _systemOptions:any = {};
  // Result result options
  _resultOptions:any = {};

  // problem with second creation....
  // no user, everything null

  constructor(private _store: Store<AppState>,
              private _projectService: ProjectService,
              private _projectDataService:ProjectDataService,
              private _staffService:StaffService,
              private _router:Router,
              public _fb: FormBuilder) {

    this._systemOptions = ProjectDataService.getSystemOptions();
    this._resultOptions = ProjectDataService.getResultOptions();

    this._form = _fb.group({

      project: this.initProject(),
      settings: this.initSettings(),
      results: this.initResults(),
      speedMin: [0],
      speedMax: [100],
      ampMax: [1]

    });

    this._form.valueChanges.subscribe(data => this.onValueChanged(data));

  }

  selectProject(item: Project) {
    this._projectService.selectProject(item.projectId)
      .subscribe(() => {
        this._router.navigate(['/rotordyn/view', item.projectId]);
      })
  }

  editProject(item: Project) {
    this._projectService.selectProject(item.projectId)
      .subscribe(() => {
        this._router.navigate(['/rotordyn/edit', item.projectId]);
      })
  }

  settingsProject(item: Project) {
    this._projectService.selectProject(item.projectId)
      .subscribe(() => {
        this._router.navigate(['/rotordyn/settings', item.projectId]);
      })
  }

  runProject(item: Project) {
    // validate, flash/alert
    // select options, confirm
    this._projectService.selectProject(item.projectId)
      .subscribe(() => {
        this._router.navigate(['/rotordyn/edit', item.projectId]);
      })
  }

  resetProject() {
    let emptyItem: Project = new Project();
    this._store.dispatch({type: 'SELECT_PROJECT', payload: emptyItem});
  }
  saveProject(item: Project) {
    this._projectService.saveProject(item);
    this.resetProject();
  }
  deleteProject(item: Project) {
    this._projectService.deleteProject(item);
  }

  /****************/
  /*    SYSTEM    */
  /****************/
  initSettings() {
    // initialize our settings
    const arr = this._systemOptions.map(opt => {
      return this._fb.control(opt.selected);
    });
    
    return this._fb.array(arr);
  }

  /****************/
  /*    RESULT    */
  /****************/
  initResults() {
    // initialize our settings
    const arr = this._resultOptions.map(opt => {
      return this._fb.control(opt.selected);
    });
    return this._fb.array(arr);
  }

  /****************/
  /*    PROJECT   */
  /****************/
  initProject() {
    // initialize our settings
    let jwt = this._staffService.getJWTValue();
    console.log(jwt.data);
    return this._fb.group({
      status: ['ACT'],
      name: ['',Validators.required],
      userId: [jwt.data.id]
    });
  }

  public onValueChanged(data?: any) {}

  private _resetFormErrors():void {
    this._formErrors = {
        
    };
  }

  private _resetProject() {
    this._form.reset();
    this._newProject = new Project();
  }

  ngOnInit() {
    this._resetFormErrors();
  }

  ngOnDestroy() {
    this._resetProject();
  }

  public createProject():void {
    let mod: ModalItem =  {
        component: NewProjectComponent,
        data: this._form
      };

    this.modals.openModal(mod);
  }

  onSubmit() {
    console.log("onClose");
    if (!this._form.valid)
      return;

    let model = this._form.value;
    let res = [...model.settings, ...model.results];

    delete model['results'];
    delete model['settings'];

    const g = Object.assign({}, model, {
      settings: res
    });

    console.log(g);
    this._projectService.createProject(g);
    this._resetProject();

  }

  save(project:Project) {
    this._projectDataService.createProject(project);
    // pass url???
    // this._router.navigate(['/rotordyn/view', result.projectId]);
  }
}

