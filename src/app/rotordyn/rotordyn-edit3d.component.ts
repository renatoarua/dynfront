import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

import { Observable } from "rxjs/Rx";

import { Store } from '@ngrx/store';
import { Project, Machine, UIElement } from '../@core/models/shaft';
import { EditorUpdateMachine, EditorSelectProjectSuccess } from '../@core/store/actions';
import { AppState, CollectionState, EditorState, ProjectStatus } from '../@core/store/models';
import { getProjectStatus, getSelectedProject } from '../@core/store/reducers';

import { ProjectService } from '../@core/services/project.service';
import { ProjectDataService } from '../@core/services/project-data.service';

import { requestFullScreen } from '../../utils/fullscreen';

import { DynForm } from '../@core/models/dyn-form';
import { DynToolbarComponent } from './dyn-toolbar/dyn-toolbar.component';

import * as moment from "moment";
import * as _ from "underscore";

@Component({
  selector: 'rotordyn-editor3d',
  templateUrl: './rotordyn-edit3d.component.html',
})
  // styleUrls: ['./rotordyn.component.scss'],
export class RotordynEdit3dComponent implements OnInit, OnDestroy {
  @ViewChild(DynToolbarComponent) toolbar: DynToolbarComponent;
  _project:Observable<Project>;
  _status:Observable<ProjectStatus>;

  _original: Project = new Project();
  _errorMessage:string;

  isFullScreen: boolean = false;

  formModel: DynForm;

  constructor(private _projectDataService: ProjectDataService,
              private _projectService: ProjectService,
              private element: ElementRef,
              private _fb: FormBuilder,
              private _router:Router,
              private _activatedRoute:ActivatedRoute) {

    this.formModel = new DynForm(_fb);
    this._project = _projectService.selectedProject;
    this._status = _projectService.projectStatus;
    this._project.subscribe((p) => {
      this.formModel.initForm(p);
    });
  }

  public ngOnInit() {
    this.updateMachine(true);
  }

  ngOnDestroy() {
    this._projectService.closeProject();
  }

  // to its original ??? SELECT with id? last saved??
  resetProject() {
    this._projectService.resetProject(); //this._original
  }

  updateMachine(really: boolean) {
    if (!really)
      return;

    let newProject = Machine.Create(<Machine>this.formModel.form.value);
    this._projectService.updateMachine(newProject);
  }

  saveProject(item: Project) {
    this._projectService.saveProject(item);
    this.resetProject();
  }

  toggleFullScreen(changes) {
    this.isFullScreen = !this.isFullScreen;

    if(!this.isFullScreen) {
      requestFullScreen(this.element.nativeElement);
    }
  }
}

