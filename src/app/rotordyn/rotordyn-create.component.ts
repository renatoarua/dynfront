import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
// import swal, {SweetAlertOptions} from 'sweetalert2';
import { Subscription }   from 'rxjs/Subscription';

import { ProjectService } from '../@core/services/project.service';
import { ProjectDataService } from '../@core/services/project-data.service';
import { Project, Machine, Sections } from '../@core/models/shaft';
import { StaffService } from "../@core/services/staff.service";

import { requestFullScreen } from '../../utils/fullscreen';

import * as moment from "moment";
import * as _ from "underscore";

@Component({
  templateUrl: 'rotordyn-create.component.html',

})
export class RotordynCreateComponent implements OnInit, OnDestroy {
  _mode = '';
  _id:string;
  _parameters:any;
  _project:Project;

  _errorMessage:string;

  subscription: Subscription;

  isFullScreen: boolean = false;
  isVRMode: boolean = false;
  feedback: string = '';
  supportsVR: boolean = false;

  public userData:any = {};
  public disabled = false;
  public status: {isopen: boolean} = {isopen: false};

  getVRSupport(): void {
    this.supportsVR = false;
    this.isVRMode = false;
    return;
  }

  constructor(private _staffService:StaffService,
              private _projectService: ProjectService,
              private _projectDataService: ProjectDataService,
              private element: ElementRef,
              private _activatedRoute: ActivatedRoute) {

    // this.subscription = _rotordyn.shaftAnnounced$.subscribe(data => this.onValueChanged(data));
  }

  ngOnInit(): void {
    let jwtValue:any = this._staffService.getJWTValue();
    this.userData = jwtValue.data;

    // _route is activated route service. this._route.params is observable.
    // subscribe is method that takes function to retrieve parameters when it is changed.
    this._parameters = this._activatedRoute.params.subscribe(params => {
      // plus(+) is to convert 'id' to number
      if(typeof params['projectId'] !== "undefined") {
        this._id = params['projectId'];
        this._errorMessage = "";
        this._projectDataService.getProjectById(this._id)
        .subscribe(
          proj => {
            // this._rotordyn.newShaft(proj);
            this._project = proj;
          },
          error => {
            // unauthorized access
            if(error.status == 401 || error.status == 403) {
              this._staffService.unauthorizedAccess(error);
            } else {
              this._errorMessage = error.data.message;
            }
          }
        );
      } else {
        // try go back
      }
    });
  }
  
  onValueChanged(data:Project) {
    this._project = data;
    // this.changeModel(data);
    //console.log(this._project);
  }

  changeModel(data) {
    // this.shaftData.version += 1;
  }

  toggleFullScreen(changes) {
    this.isFullScreen = !this.isFullScreen;

    if(!this.isFullScreen) {
      requestFullScreen(this.element.nativeElement);
    }
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}