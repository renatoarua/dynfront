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

import { ResponseBody } from '../@core/models/response-body';
import { ProjectService } from '../@core/services/project.service';
import { ProjectDataService } from '../@core/services/project-data.service';

import {CHART_DESC} from './chart-description';

@Component({
  selector: 'rotordyn-dashboard',
  templateUrl: './rotordyn-detail.component.html',
  styleUrls: ['./rotordyn-detail.component.scss'],
})
export class RotordynDetailComponent implements OnInit, OnDestroy {
  project$:Observable<Project>;
  status$:Observable<ProjectStatus>;

  _project: Project;

  _id: string;
  _errorMessage:string;
  alive:boolean = true;

  chartData: any;

  title: string = "";
  description: string = "";
  current: string = 'line';

  show: any = {}

  constructor(private _projectService: ProjectService,
              private _dataService: ProjectDataService,
              private _staffService:StaffService,
              private _router:Router,
              private _activatedRoute:ActivatedRoute,
              private menuService: NbMenuService) {

    this.project$ = _projectService.selectedProject;
    this.status$ = _projectService.projectStatus;
    this.project$.subscribe(project => {
      if(project) {
        this._id = project.projectId;
        this._project = project;
      }
    });
    this.menuService
      .onItemClick()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data: { tag: string; item: NbMenuItem }) => {
        let tag = data.item.title;
        switch(tag) {
          case 'Edit':
            this.editProject();
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
    this.show['line'] = true;
    this.title = CHART_DESC.filter(x => x.name == 'line')[0]['title'];
    this.description = CHART_DESC.filter(x => x.name == 'line')[0]['text'];
  }

  resetCurrent() {
    this.show = {
      line: false,
      campbell: false,
      stiffness: false,
      modes: false,
      unbalance: false,
      constant: false,
      torsional: false,
      time: false
    };
  }

  onValueChanged(data:Project) {
    // this.project$ = data;
  }

  selectChart(name) {
    /*this.show = this.show.map(item => Object.assign({}, item, {
      selected: this.project$.projectsetting.systemoptions[item.value] === true
    }));*/
    this.resetCurrent();
    this.show[name] = true;
    this.title = CHART_DESC.filter(x => x.name == name)[0]['title'];
    this.description = CHART_DESC.filter(x => x.name == name)[0]['text'];
  }

  loadChart(name) {
    this._dataService.getProjectChart(this._id, name)
      .subscribe((result:ResponseBody) => {
        if(result.status == 200) {
          let res = result.data;
          this.chartData = res;
          // Object.assign(this.graph.data, res.data);
          // Object.assign(this.graph.layout, res.layout);
          // this.found = true;
        }
      });
  }

  ngOnDestroy() {
    this.alive = false;
    // close
    // this._store.dispatch({type: 'CLOSE_PROJECT', payload: {}});
  }

  public editProject():void {
    this._router.navigate(['/rotordyn/edit', this._id]);
  }

  public settingsProject():void {
    this._router.navigate(['/rotordyn/settings', this._id]);
  }

  public runProject():void {
    this._dataService.Run(this._id)
      .subscribe((data) => {
        console.log(data);
      });
  }


}
