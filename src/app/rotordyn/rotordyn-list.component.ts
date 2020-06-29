// import {
//   Component,
//   trigger,
//   transition,
//   animate,
//   style,
//   state,
//   ElementRef,
//   OnInit
// } from '@angular/core';

import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
// import swal, {SweetAlertOptions} from 'sweetalert2';

import {StaffService} from "../@core/services/staff.service";

import { ProjectDataService } from '../@core/services/project-data.service';

import { Project, Machine } from '../@core/models/shaft';
import { requestFullScreen } from '../../utils/fullscreen';

@Component({
  templateUrl: 'rotordyn-list.component.html',

})
export class RotordynListComponent implements OnInit {
  _projects:Project[];
  _errorMessage:string;

  constructor(private _projectService:ProjectDataService,
              private _staffService:StaffService,
              private _router:Router) {}

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this._projects = null;
    /*this._projectService.getAllProjects()
    .subscribe(
      proj => {
        this._projects = proj;
        console.log(proj);
      },
      error =>  {
        // unauthorized access
        if(error.status == 401 || error.status == 403) {
          this._staffService.unauthorizedAccess(error);
        } else {
          this._errorMessage = error.data.message;
        }
      }
    );*/
  }

  public viewProject(project:Project):void {
    this._router.navigate(['/rotordyn/view', project.projectId]);
  }

  public editProject(project:Project):void {
    this._router.navigate(['/rotordyn/edit', project.projectId]);
  }

}
