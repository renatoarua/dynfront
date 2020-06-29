import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from "@angular/forms";
import { CustomValidators } from '../../@core/validators/custom-validators';

import { Router, ActivatedRoute } from "@angular/router";
import { NbMenuService, NbMenuItem } from '@nebular/theme';

import { Observable, Subscription } from "rxjs/Rx";
import { takeWhile } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { MachineError, Project, Machine, ProjectSetting, DisplaySetting, ResultCampbell, ResultStiffness, ResultModes, ResultConstant, ResultUnbalance, ResultTorsional, ResultTime, ResultResponseModel, ResultForceModel, ResultPhaseModel, ResultTorkPhaseModel } from '../../@core/models/shaft';
import { AppState, ProjectStatus } from '../../@core/store/models';
import { getProjectStatus, getSelectedProject, getEditorErrors } from '../../@core/store/reducers';

import { ProjectService } from '../../@core/services/project.service';
import { ProjectDataService } from '../../@core/services/project-data.service';

import { ModalItem } from '../../components/modal-item';
import { DynModalComponent } from '../../components/dyn-modal.component';
import { CampbellComponent } from '../../@core/partials/campbell.component';
import { StiffnessComponent } from '../../@core/partials/stiffness.component';
import { ModesComponent } from '../../@core/partials/modes.component';
import { UnbalanceComponent } from '../../@core/partials/unbalance.component';
import { ConstantComponent } from '../../@core/partials/constant.component';
import { TorsionalComponent } from '../../@core/partials/torsional.component';
import { TimeComponent } from '../../@core/partials/time.component';

import { MachineSetupError } from '../../@core/services/machine-setup.error';

import * as _ from "underscore";

export interface ITool {
  title: string;
  name: string;
  component: any;
  icon: string;
  index?: number;
}

interface CardSettings {
  label: string;
  value: string;
  iconClass: string;
  type: string;
  category: string;
  selected: boolean;
}

interface ErrorMsgs {
  resultcampbell: boolean;
  resultstiffness: boolean;
  resultmodes: boolean;
  resultconstant: boolean;
  resultunbalance: boolean;
  resulttorsional: boolean;
  resulttime: boolean;
  responses: boolean;
}

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
  // styleUrls: ['./project-settings.component.scss'],
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DynModalComponent) modals$: DynModalComponent;
  @ViewChild('form') ngForm: NgForm;
  $project:Observable<Project>;
  $errors:Observable<MachineError[]>;
  _status:Observable<ProjectStatus>;

  _errors: MachineError[] = [];
  _errorCount = 0;
  _errorMsgs: ErrorMsgs;

  _original: Project;
  _project: Project;
  _errorMessage:string;
  // _alive:boolean = true;
  isEditing: number = -1;

  _form:FormGroup;
  _formErrors:any;
  _submitted:boolean = false;
  _dirty:boolean = false;

  onConfirm$: Subscription;

   // System entry options
  _systemOptions:any = {};
  // System result options
  _resultOptions:any = {};

  commonSystemCardsSet: CardSettings[];
  commonResultCardsSet: CardSettings[];

  editorTools: ITool[] = [
    {title: "Add Campbell", name: 'resultcampbell', component:CampbellComponent, icon:'fa fa-arrows-h' },
    {title: "Add Modes", name: 'resultmodes', component:ModesComponent, icon:'nb-menu' },
    {title: "Add Stiffness Map", name: 'resultstiffness', component:StiffnessComponent, icon:'nb-loop-circled' },
    {title: "Add Unbalance Responce", name: 'resultunbalance', component:UnbalanceComponent, icon:'nb-loop' },
    {title: "Add Constant Response", name: 'resultconstant', component:ConstantComponent, icon:'nb-sunny' },
    {title: "Add Torsional Analysis", name: 'resulttorsional', component:TorsionalComponent, icon:'nb-sunny-circled' },
    {title: "Add Time Response", name: 'resulttime', component:TimeComponent, icon:'fa fa-arrows-v' },
  ];
  currentTool: ITool;
  _units: any = {};

  constructor(private _dataService:ProjectDataService,
              private _projectService:ProjectService,
              private _router:Router,
              private _activatedRoute:ActivatedRoute,
              private _menuService: NbMenuService,
              public _fb: FormBuilder) {

    this._systemOptions = ProjectDataService.getSystemOptions();
    this._resultOptions = ProjectDataService.getResultOptions();
    this._units = ProjectService.getUnits();

    this.commonSystemCardsSet = this._systemOptions.map((item) => {
      return <CardSettings>item;
    });

    this.commonResultCardsSet = this._resultOptions.map((item) => {
      return <CardSettings>item;
    });

    this.clearErrors();

    this.$project = _projectService.selectedProject;
    this._status = _projectService.projectStatus;
    this.$errors = _projectService.editorErrors;

    this.$project.subscribe(project => {
      if(project) {
        this._original = project;
        this._project = project;
        this.onChange();
        // console.log(project.projectsetting);
      }
    });

    this.$errors.subscribe(errors => {
      this._errors = errors;
      this._errorCount = errors.length;
      if(errors.length > 0) {
        // throw "this is wrong for some reason";
        errors.forEach((item, idx) => {
          if(item.message.includes("Campbell"))
            this._errorMsgs.resultcampbell = true;
          if(item.message.includes("Stiffness"))
            this._errorMsgs.resultstiffness = true;
          if(item.message.includes("Modes"))
            this._errorMsgs.resultmodes = true;
          if(item.message.includes("Constant"))
            this._errorMsgs.resultconstant = true;
          if(item.message.includes("Unbalance"))
            this._errorMsgs.resultunbalance = true;
          if(item.message.includes("Torsional"))
            this._errorMsgs.resulttorsional = true;
          if(item.message.includes("Time"))
            this._errorMsgs.resulttime = true;
          if(item.message.includes("Responses"))
            this._errorMsgs.responses = true;
        });
        // try {
        //   throw new MachineSetupError(errors[0]);
        // } catch(e) {}
        // console.log(this._errorMsgs);
      }
    });

    // this._form.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  ngOnInit() {
    this.onConfirm$ = this.modals$.onConfirm.subscribe(params => this.onConfirm(params));
  }

  ngAfterViewInit() {
    // this.ngForm.form.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  ngOnDestroy() {
    this.onConfirm$.unsubscribe();
  }

  coords(n) {
    let arr = ['X', 'Z', '&theta;', '&psi;'];
    return arr[n-1];
  }

  openModal(name:string, payload:any=null):void {
    let tool = this.editorTools.find(x => x.name == name);
    let mod: ModalItem =  {
        component: tool.component,
        data: this.selectTool(name, payload)
      };

    this.currentTool = tool;
    this.modals$.openModal(mod);
  }

  onConfirm(load) {
    if (!this.currentTool)
      return;

    let name = this.currentTool.name;
    this.addTool(name, load);
    this.currentTool = null;
  }

  onCancel() {}

  resetForm() {
    this._project = this._original;
  }

  onValueChanged(data) {
    console.log("form changed");
    console.log(data);
  }

  categories(list, cat) {
    return list.filter(x => x.category === cat);
  }

  /****************/
  /*    SYSTEM    */
  /****************/
  initSystem() {
    // initialize our settings
    // this.commonSystemCardsSet.filter((x) => x.value === foundation)[0];
    // ves: this.commonSystemCardsSet[3].selected,
    // abs: this.commonSystemCardsSet[4].selected
    return this._fb.group({
      foundation: this.commonSystemCardsSet[0].selected,
      rollerbearing: this.commonSystemCardsSet[1].selected,
      journalbearing: this.commonSystemCardsSet[2].selected,
      ves: false,
      abs: false
    });
  }

  /****************/
  /*    RESULT    */
  /****************/
  initResults() {
    // initialize our settings
    return this._fb.group({
      staticLine: this.commonResultCardsSet[0].selected,
      fatigue: this.commonResultCardsSet[1].selected,
      campbell: this.commonResultCardsSet[2].selected,
      modes: this.commonResultCardsSet[3].selected,
      criticalMap: this.commonResultCardsSet[4].selected,
      unbalanceResponse: this.commonResultCardsSet[5].selected,
      constantResponse: this.commonResultCardsSet[6].selected,
      timeResponse: this.commonResultCardsSet[7].selected,
      torsional: this.commonResultCardsSet[8].selected,
      balanceOptimization: this.commonResultCardsSet[9].selected,
      vesOptimization: this.commonResultCardsSet[10].selected,
      absOptimization: this.commonResultCardsSet[11].selected
    });
  }

  /****************/
  /*   RESULTS    */
  /****************/
  initCampbell(res?: ResultCampbell) {
    let group = this._fb.group({
      initialSpin: res ? +res.initialSpin : ['0'],
      finalSpin: res ? +res.finalSpin : ['1'],
      steps: res ? +res.steps : ['1'],
      frequencies: res ? +res.frequencies : ['1'],
    }, { validator: CustomValidators.ValidateSpinConstraint });

    group.controls['initialSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['finalSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['steps'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls['frequencies'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    return group;
  }

  editCampbell(i: number) {
    let pay = this._project.projectsetting.resultcampbell[i];
    this.isEditing = i;
    this.openModal('resultcampbell', pay);
  }

  updateCampbell(res: ResultCampbell) {
    this._project.projectsetting.resultcampbell.push( res );
  }

  removeCampbell(i: number) {
    this._project.projectsetting.resultcampbell.splice(i,1);
    this.validate(this._project);
  }

  initModes(res?: ResultModes) {
    let group = this._fb.group({
      maxFrequency: res ? +res.maxFrequency : ['0'],
      modes: res ? +res.modes : ['1'],
    });

    group.controls['maxFrequency'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['modes'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    return group;
  }

  editModes(i: number) {
    let pay = this._project.projectsetting.resultmodes[i];
    this.isEditing = i;
    this.openModal('resultmodes', pay);
  }

  updateModes(res: ResultModes) {
    this._project.projectsetting.resultmodes.push( res );
  }

  removeModes(i: number) {
    this._project.projectsetting.resultmodes.splice(i,1);
    this.validate(this._project);
  }

  initStiff(res?: ResultStiffness) {
    let group = this._fb.group({
      initialStiffness: res ? +res.initialStiffness : ['1'],
      initialSpin: res ? +res.initialSpeed : ['0'],
      finalSpin: res ? +res.finalSpeed : ['1'],
      decades: res ? +res.decades : ['1'],
      frequencies: res ? +res.frequencies : ['1'],
    }, { validator: CustomValidators.ValidateSpinConstraint });

    group.controls['initialStiffness'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['initialSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['finalSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['decades'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls['frequencies'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    return group;
  }

  editStiff(i: number) {
    let pay = this._project.projectsetting.resultstiffness[i];
    this.isEditing = i;
    this.openModal('resultstiffness', pay);
  }

  updateStiff(res: ResultStiffness) {
    this._project.projectsetting.resultstiffness.push( res );
  }

  removeStiff(i: number) {
    this._project.projectsetting.resultstiffness.splice(i,1);
    this.validate(this._project);
  }

  initUnbalance(res?: ResultUnbalance) {
    let responses = [];
    let phases = [];
    if (res) {
      if(res.responses) {
        res.responses.forEach((item, idx) => {
          responses.push( this.initResponse(item) );
        });
      }
      if(res.phases) {
        res.phases.forEach((item, idx) => {
          phases.push( this.initPhase(item) );
        });
      }
    }

    let group = this._fb.group({
      initialSpin: res ? +res.initialSpin : ['0'],
      finalSpin: res ? +res.finalSpin : ['1'],
      steps: res ? +res.steps : ['1'],
      modes: res ? +res.modes : ['1'],
      responses: new FormArray(responses),
      phases: new FormArray(phases),
    }, { validator: [CustomValidators.ValidateSpinConstraint, CustomValidators.ValidateMinArrayLength('responses', 'Response'), CustomValidators.ValidateMinArrayLength('phases', 'Unbalance')] });

    group.controls['initialSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['finalSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['steps'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls['modes'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls.responses.markAsDirty();
    group.controls.phases.markAsDirty();
    return group;
  }

  editUnbalance(i: number) {
    let pay = this._project.projectsetting.resultunbalance[i];
    this.isEditing = i;
    this.openModal('resultunbalance', pay);
  }

  updateUnbalance(res: ResultUnbalance) {
    this._project.projectsetting.resultunbalance.push( res );
  }

  removeUnbalance(i: number) {
    this._project.projectsetting.resultunbalance.splice(i,1);
    this.validate(this._project);
  }

  initConstant(res?: ResultConstant) {
    let responses = [];
    let forces = [];
    if (res) {
      if(res.responses) {
        res.responses.forEach((item, idx) => {
          responses.push( this.initResponse(item) );
        });
      }
      if(res.forces) {
        res.forces.forEach((item, idx) => {
          forces.push( this.initForce(item) );
        });
      }
    }

    let group = this._fb.group({
      initialFrequency: res ? +res.initialFrequency : ['0'],
      finalFrequency: res ? +res.finalFrequency : ['1'],
      steps: res ? +res.steps : ['1'],
      modes: res ? +res.modes : ['1'],
      speed: res ? +res.speed : ['1'],
      responses: new FormArray(responses),
      forces: new FormArray(forces),
    }, { validator: [CustomValidators.ValidateFrequencyConstraint, CustomValidators.ValidateMinArrayLength('responses', 'Response'), CustomValidators.ValidateMinArrayLength('forces', 'Force')] });

    group.controls['initialFrequency'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['finalFrequency'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['steps'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls['modes'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls['speed'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls.responses.markAsDirty();
    group.controls.forces.markAsDirty();
    return group;
  }

  editConstant(i: number) {
    let pay = this._project.projectsetting.resultconstant[i];
    this.isEditing = i;
    this.openModal('resultconstant', pay);
  }

  updateConstant(res: ResultConstant) {
    this._project.projectsetting.resultconstant.push( res );
  }

  removeConstant(i: number) {
    this._project.projectsetting.resultconstant.splice(i,1);
    this.validate(this._project);
  }

  initTorsional(res?: ResultTorsional) {
    let responses = [];
    let phases = [];
    if (res) {
      if(res.responses) {
        res.responses.forEach((item, idx) => {
          responses.push( this.initResponse(item, true) );
        });
      }
      if(res.phases) {
        res.phases.forEach((item, idx) => {
          phases.push( this.initTorkPhase(item) );
        });
      }

    }
    let group = this._fb.group({
      initialFrequency: res ? +res.initialFrequency : ['0'],
      finalFrequency: res ? +res.finalFrequency : ['1'],
      steps: res ? +res.steps : ['1'],
      modes: res ? +res.modes : ['1'],
      responses: new FormArray(responses),
      phases: new FormArray(phases),
    }, { validator: [CustomValidators.ValidateFrequencyConstraint, , CustomValidators.ValidateMinArrayLength('responses', 'Response'), CustomValidators.ValidateMinArrayLength('phases', 'Torque')] });

    group.controls['initialFrequency'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['finalFrequency'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['steps'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls['modes'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls.responses.markAsDirty();
    group.controls.phases.markAsDirty();
    return group;
  }

  editTorsional(i: number) {
    let pay = this._project.projectsetting.resulttorsional[i];
    this.isEditing = i;
    this.openModal('resulttorsional', pay);
  }

  initNewTorsional(torsion?: ResultTorsional) {
    return { data: this.initTorsional(torsion), showcoord: false };
  }

  updateTorsional(res: ResultTorsional) {
    this._project.projectsetting.resulttorsional.push( res );
  }

  removeTorsional(i: number) {
    this._project.projectsetting.resulttorsional.splice(i,1);
    this.validate(this._project);
  }

  initTime(res?: ResultTime) {
    let phases = [];
    if(res && res.phases) {
      res.phases.forEach((item, idx) => {
        phases.push( this.initPhase(item) );
      });
    }

    let group = this._fb.group({
      initialSpin: res ? +res.initialSpin : ['0'],
      finalSpin: res ? +res.finalSpin : ['1'],
      steps: res ? +res.steps : ['1'],
      modes: res ? +res.modes : ['1'],
      phases: new FormArray(phases),
    }, { validator: [CustomValidators.ValidateSpinConstraint, CustomValidators.ValidateMinArrayLength('phases', 'Unbalance')] });

    group.controls['initialSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['finalSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['steps'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls['modes'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls.phases.markAsDirty();
    return group;
  }

  editTime(i: number) {
    let pay = this._project.projectsetting.resulttime[i];
    this.isEditing = i;
    this.openModal('resulttime', pay);
  }

  updateTime(res: ResultTime) {
    this._project.projectsetting.resulttime.push( res );
  }

  removeTime(i: number) {
    this._project.projectsetting.resulttime.splice(i,1);
    this._dirty = true;
    this.validate(this._project);
  }

  getSectionLength(no=-1) {
    let n = this._project.machine.sections.length;
    if(no == 0)
      return 0;
    else if(no > 0)
      n = no;
    return (n > 0) ? +this._project.machine.sections[n-1].position : 0;
  }

  initResponse(res?: ResultResponseModel, nocoord=false) {
    let n = this.getSectionLength(this._project.machine.sections.length);
    let group = this._fb.group({
      position: res ? +res.position : ['0'],
      coord: res ? +res.coord : [''],
    }, { validator: CustomValidators.ValidateLengthConstraint(n) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    return group;
  }

  initForce(res?: ResultForceModel) {
    let n = this.getSectionLength(this._project.machine.sections.length);
    let group = this._fb.group({
      position: res ? +res.position : ['0'],
      coord: res ? +res.coord : [''],
      force: res ? +res.force : ['1'],
    }, { validator: CustomValidators.ValidateLengthConstraint(n) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['force'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    return group;
  }

  initPhase(res?: ResultPhaseModel) {
    let n = this.getSectionLength(this._project.machine.sections.length);
    let group = this._fb.group({
      position: res ? +res.position : ['0'],
      unbalance: res ? +res.unbalance : ['1'],
      phase: res ? +res.phase : ['']
    }, { validator: CustomValidators.ValidateLengthConstraint(n) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['phase'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    return group;
  }

  initTorkPhase(res?: ResultTorkPhaseModel) {
    let n = this.getSectionLength(this._project.machine.sections.length);
    let group = this._fb.group({
      position: res ? +res.position : ['0'],
      tork: res ? +res.tork : ['1'],
      phase: res ? +res.phase : ['']
    }, { validator: CustomValidators.ValidateLengthConstraint(n) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['tork'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    return group;
  }

  selectTool(name: string, payload:any = null) {
    switch(name) {
      case 'resultcampbell':
        return this.initCampbell(payload);
      case 'resultstiffness':
        return this.initStiff(payload);
      case 'resultmodes':
        return this.initModes(payload);
      case 'resultunbalance':
        return this.initUnbalance(payload);
      case 'resultconstant':
        return this.initConstant(payload);
      case 'resulttorsional':
        return this.initNewTorsional(payload);
      case 'resulttime':
        return this.initTime(payload);
      default:
        return this._fb.group({});
    }
  }

  optionChanged($event) {
    this.validate(this._project);
    // console.log(this._project.projectsetting.resultoptions);
  }

  onSubmit() {
    // if (!this._form.valid)
    //   return;

    // let model = this._form.value;

    /*let g = Object.assign({}, this._project.projectsetting, {
      systemoptions: model.systemoptions,
      resultoptions: model.resultoptions,
      resultcampbell: model.resultcampbell,
      resultstiffness: model.resultstiffness,
      resultmodes: model.resultmodes,
      resultconstant: model.resultconstant,
      resultunbalance: model.resultunbalance,
      resulttorsional: model.resulttorsional,
      resulttime: model.resulttime
    });*/

    // console.log(g);
    this._projectService.updateSettings(this._project.projectsetting);
  }

  addTool(name, data) {
    // const control = <FormArray>this._form.controls[name];
    if(this.isEditing > 0) {
      this._project.projectsetting[name][this.isEditing] = data.value;
    } else {
      this._project.projectsetting[name].push(data.value);
      // control.push(data);
    }

    // this.changeModel.emit(true);
    this.isEditing = -1;
    // this.onSubmit();
    this.validate(this._project);
    console.log("validate, addTool()");
  }

  save() {
    this._projectService.saveProject(this._project);
    this._dirty = false;
  }

  editProject() {
    this._router.navigate(['/rotordyn/edit/2d', this._project.projectId]);
  }

  viewProject() {
    this._router.navigate(['/rotordyn/view', this._project.projectId]);
  }

  runProject() {
    if (this._errorCount > 0)
      return;
    this._dataService.Run(this._project.projectId)
      .subscribe((data) => {
        this._router.navigate(['/rotordyn/logger', this._project.projectId, data['id']]);
      });
  }

  onChange() {
    if(!this._project)
      return;

    this.commonSystemCardsSet = this.commonSystemCardsSet.map(item => Object.assign({}, item, {
      selected: this._project.projectsetting.systemoptions[item.value] === true
    }));

    this.commonResultCardsSet = this.commonResultCardsSet.map(item => Object.assign({}, item, {
      selected: this._project.projectsetting.resultoptions[item.value] === true
    }));

    this.validate(this._project);
    console.log("validate, onChange()");
  }

  fix(err) {

  }

  clearErrors() {
    this._errorMsgs = {
      resultcampbell: false,
      resultstiffness: false,
      resultmodes: false,
      resultconstant: false,
      resultunbalance: false,
      resulttorsional: false,
      resulttime: false,
      responses: false
    };
  }

  validate(proj) {
    this.clearErrors();
    this._projectService.validate(proj);
    this._dirty = _.isEqual(this._original, this._project);
  }
}