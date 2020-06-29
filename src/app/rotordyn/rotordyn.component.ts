import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { StaffService } from "../@core/services/staff.service";
import { NbMenuService, NbMenuItem } from '@nebular/theme';

import { Observable } from "rxjs/Rx";
import { takeWhile } from 'rxjs/operators';
// import 'rxjs/add/operator/first';

import { Store } from '@ngrx/store';
import { Project, Machine } from '../@core/models/shaft';
import { AppState, ProjectStatus } from '../@core/store/models';
import { getProjectStatus, getSelectedProject } from '../@core/store/reducers';

import { ProjectService } from '../@core/services/project.service';
import { ProjectDataService } from '../@core/services/project-data.service';

@Component({
  selector: 'rotordyn-dashboard',
  templateUrl: './rotordyn.component.html',
})
  // styleUrls: ['./rotordyn.component.scss'],
export class RotordynComponent implements OnInit, OnDestroy {
  _project:Observable<Project>;
  _status:Observable<ProjectStatus>;

  _id: string;
  _errorMessage:string;
  alive:boolean = true;

  constructor(private _projectService: ProjectService,
              private _projectDataService: ProjectDataService,  
              private _staffService:StaffService,
              private _router:Router,
              private _activatedRoute:ActivatedRoute,
              private menuService: NbMenuService) {

    this._project = _projectService.selectedProject;
    this._status = _projectService.projectStatus;
    this._project.subscribe(project => {
      if(project)
        this._id = project.projectId;
    });
    this.menuService
      .onItemClick()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data: { tag: string; item: NbMenuItem }) => {
        let tag = data.item.title;
        switch(tag) {
          case 'Edit (2D)':
            this.visual2DProject();
            break;
          case 'Edit (3D)':
            this.visualProject();
            break;
          case 'Settings':
            this.settingsProject();
            break;
          case 'Calculate':
            this.runProject();
            break;
        }
      });
  }

  public ngOnInit() {

  }

  onValueChanged(data:Project) {
    // this._project = data;
  }

  ngOnDestroy() {
    this.alive = false;
    // close
    // this._store.dispatch({type: 'CLOSE_PROJECT', payload: {}});
  }

  public visualProject():void {
    this._router.navigate(['/rotordyn/edit/3d', this._id]);
  }

  public visual2DProject():void {
    this._router.navigate(['/rotordyn/edit/2d', this._id]);
  }

  public settingsProject():void {
    this._router.navigate(['/rotordyn/settings', this._id]);
  }

  public runProject():void {
    this._projectDataService.Run(this._id)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
