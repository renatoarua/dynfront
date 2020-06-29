import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CustomValidators } from 'ng2-validation';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

import { ProjectDataService } from '../@core/services/project-data.service';
import { Project, Machine, ProjectSetting } from '../@core/models/shaft';
import { StaffService } from "../@core/services/staff.service";

import { requestFullScreen } from '../../utils/fullscreen';

import * as moment from "moment";
import * as _ from "underscore";

@Component({
  templateUrl: 'rotordyn-form.component.html',

})
export class RotordynFormComponent implements OnInit, OnDestroy {
  _mode = '';
  _id:string;
  _parameters:any;
  _project:Project;

  _errorMessage:string;

  _form:FormGroup;
  _formErrors:any;
  _submitted:boolean = false;

  // public machineData: Machine;
  // private _shaft: ShaftSections;

  // Status Types
  _systemOptions:any = {};

  // Roles
  _resultOptions:any = {};

  constructor(private _projectService:ProjectDataService,
              private _staffService:StaffService,
              private _router:Router,
              private _activatedRoute:ActivatedRoute,
              public _fb: FormBuilder) {

    this._form = _fb.group({
      machineId: [''],
      length: [''],
      ldRatio: [''],

      sections: this._fb.array([
        this.initSections(),
      ]),
      ribs: this._fb.array([
        this.initRibs(),
      ]),
      discs: this._fb.array([
        this.initDiscs(),
      ]),
      inertias: this._fb.array([
        this.initInertias(),
      ]),

      rollerbearings: this._fb.array([
        this.initRollerBearings(),
      ]),
      journalbearings: this._fb.array([
        this.initJournalBearings(),
      ]),

      ves: this._fb.array([
        this.initVes(),
      ]),
      abs:[''],

      foundations: this._fb.array([
        this.initFoundations(),
      ]),

    });

    this._form.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  /****************/
  /*   SECTIONS   */
  /****************/
  initSections() {
    // initialize our section
    return this._fb.group({
      sectionId: [''],
      materialId: [''],
      position: [''],
      externalDiameter: [''],
      internalDiameter: [''],
      young: [''],
      poisson: [''],
      density: [''],
      axialForce: [''],
      magneticForce: [''],
    });
  }

  addSection() {
    // add section to the shaft section list
    const control = <FormArray>this._form.controls['sections'];
    control.push(this.initSections());
  }

  removeSection(i: number) {
    // remove section from the shaft section list
    const control = <FormArray>this._form.controls['sections'];
    control.removeAt(i);
  }

  /****************/
  /*    DISCS     */
  /****************/
  initDiscs() {
    // initialize our disc
    return this._fb.group({
      discId: [''],
      materialId: [''],
      position: [''],
      externalDiameter: [''],
      internalDiameter: [''],
      thickness: [''],
      density: [''],
    });
  }

  addDisc() {
    // add disc to the shaft discs list
    const control = <FormArray>this._form.controls['discs'];
    control.push(this.initDiscs());
  }

  removeDisc(i: number) {
    // remove disc from the shaft discs list
    const control = <FormArray>this._form.controls['discs'];
    control.removeAt(i);
  }

  /****************/
  /*    RIBS      */
  /****************/
  initRibs() {
    // initialize our rib
    return this._fb.group({
      ribId: [''],
      materialId: [''],
      position: [''],
      number: [''],
      webThickness: [''],
      webDepth: [''],
      flangeWidth: [''],
      flangeThick: [''],
    });
  }

  addRib() {
    // add rib to the shaft ribs list
    const control = <FormArray>this._form.controls['ribs'];
    control.push(this.initRibs());
  }

  removeRib(i: number) {
    // remove rib from the shaft ribs list
    const control = <FormArray>this._form.controls['ribs'];
    control.removeAt(i);
  }

  /****************/
  /*   INERTIAS   */
  /****************/
  initInertias() {
    // initialize our inertia
    return this._fb.group({
      inertiaId: [''],
      length: [''],
      position: [''],
      mass: [''],
      ix: [''],
      iy: [''],
      iz: [''],
    });
  }

  addInertia() {
    // add inertia to the shaft inertias list
    const control = <FormArray>this._form.controls['inertias'];
    control.push(this.initInertias());
  }

  removeInertia(i: number) {
    // remove inertia to the shaft inertias list
    const control = <FormArray>this._form.controls['inertias'];
    control.removeAt(i);
  }

  /****************/
  /*   BEARINGS   */
  /****************/
  initRollerBearings() {
    // initialize our bearing
    return this._fb.group({
      rollerBearingId: [''],
      position: [''],
      mass: [''],
      inertia: [''],
      kxx: [''],
      kxz: [''],
      kzx: [''],
      kzz: [''],
      cxx: [''],
      cxz: [''],
      czx: [''],
      czz: [''],
      ktt: [''],
      ktp: [''],
      kpt: [''],
      kpp: [''],
      ctt: [''],
      ctp: [''],
      cpt: [''],
      cpp: [''],
    });
  }

  addRollerBearing() {
    // add bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['rollerbearings'];
    control.push(this.initRollerBearings());
  }

  removeRollerBearing(i: number) {
    // remove bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['rollerbearings'];
    control.removeAt(i);
  }

  initJournalBearings() {
    // initialize our bearing
    return this._fb.group({
      journalBearingId: [''],
      bearingId: [''],
      position: [''],
      speed: [''],
      kxx: [''],
      kxz: [''],
      kzx: [''],
      kzz: [''],
      cxx: [''],
      cxz: [''],
      czx: [''],
      czz: [''],
    });
  }

  addJournalBearing() {
    // add bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['journalbearings'];
    control.push(this.initJournalBearings());
  }

  removeJournalBearing(i: number) {
    // remove bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['journalbearings'];
    control.removeAt(i);
  }

  /****************/
  /*      VES     */
  /****************/
  initVes() {
    // initialize our ves
    //[0, Validators.compose([])],
    return this._fb.group({
      vesId: [''],
      position: [''],
      simple: [''], 
      materials:  this._fb.array([]),
      single: [''],
      type: [''],
      rotations: this._fb.array([]),
      translations: this._fb.array([]),
      rollerbearings: this._fb.array([]),
    });
  }

  initMaterials() {
    return this._fb.group({
      sheetMaterialId: [''],
      go: [''],
      goo: [''],
      beta: [''],
      b1: [''],
      theta1: [''],
      theta2: [''],
      temperature: [''],
      temperatureRef: [''],
    });
  }

  addVes() {
    const control = <FormArray>this._form.controls['ves'];
    control.push(this.initVes());
  }

  removeVes(i: number) {
    // remove bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['ves'];
    control.removeAt(i);
  }

  /****************/
  /*  FOUNDATION  */
  /****************/
  initFoundations() {
    // initialize our bearing
    return this._fb.group({
      foundationId: [''],
      position: [''],
      mass: [''],
      kxx: [''],
      kzz: [''],
      cxx: [''],
      czz: [''],
    });
  }

  addFoundation() {
    // add bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['foundations'];
    control.push(this.initFoundations());
  }

  removeFoundation(i: number) {
    // remove bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['foundations'];
    control.removeAt(i);
  }

  public onValueChanged(data?: any) {}

  private _resetFormErrors():void {
    this._formErrors = {
        
    };
  }

  private _resetProject() {
    this._project = new Project();
  }

  public ngOnInit() {
    this._resetFormErrors();
    this._resetProject();

    // _route is activated route service. this._route.params is observable.
    // subscribe is method that takes function to retrieve parameters when it is changed.
    this._parameters = this._activatedRoute.params.subscribe(params => {
      // plus(+) is to convert 'id' to number
      if(typeof params['projectId'] !== "undefined") {
        this._id = params['projectId'];
        this._errorMessage = "";
        this._projectService.getProjectById(this._id)
        .subscribe(
          proj => {
            this._project = proj;
            this._mode = 'update';
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
          this._mode = 'create';
      }
    });
  }

  public ngOnDestroy() {
    // this._parameters.unsubscribe();
    this._project = new Project();
  }

  onSubmit() {
    let model = <Machine>this._form.value;
    this.save(model);
    console.log('submit');
  }

  save(model: Machine) {
    // call API to save customer
    this._projectService.updateMachine(model)
      .subscribe(result => {
        console.log(result)
      });

    console.log(model);
  }
}

