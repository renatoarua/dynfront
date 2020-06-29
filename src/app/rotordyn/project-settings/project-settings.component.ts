import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { ProjectService } from '../../@core/services/project.service';
import { ProjectDataService } from '../../@core/services/project-data.service';
import { MachineError, Project, Machine, ProjectSetting, DisplaySetting } from '../../@core/models/shaft';

interface CardSettings {
  label: string;
  value: string;
  iconClass: string;
  type: string;
  selected: boolean;
}

@Component({
  selector: 'project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
  // styleUrls: ['./project-settings.component.scss'],
export class ProjectSettingsComponent implements OnInit {
  _project: Project;
  _originalName: string;
  _id: string;

  _form:FormGroup;
  _formErrors:any;
  _submitted:boolean = false;

  @Input()
  set model(value: Project) {
    if(value) {
      this._originalName = value.name;
      this._id = value.projectId;
    }
    this._project = Object.assign({}, value);
    this.onChange();
  }

  @Output('onChange') changeModel: EventEmitter<any> = new EventEmitter<any>();

  // System entry options
  private _systemOptions:any = {};
  // System result options
  private _resultOptions:any = {};

  commonSystemCardsSet: CardSettings[];
  commonResultCardsSet: CardSettings[];

  private errors: MachineError[] = [];

  constructor(private _dataService:ProjectDataService,
              private _projectService:ProjectService,
              public _fb: FormBuilder,
              private _router: Router) {

    this._systemOptions = ProjectDataService.getSystemOptions();
    this._resultOptions = ProjectDataService.getResultOptions();

    this.commonSystemCardsSet = this._systemOptions.map((item) => {
      return <CardSettings>item;
    });

    this.commonResultCardsSet = this._resultOptions.map((item) => {
      return <CardSettings>item;
    });

    this._form = _fb.group({
      settings: this.initSettings(),
      results: this.initResults()
    });

    this._form.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  /****************/
  /*    SYSTEM    */
  /****************/
  initSettings() {
    // initialize our settings
    // this.commonSystemCardsSet.filter((x) => x.value === foundation)[0];
    return this._fb.group({
      foundation: this.commonSystemCardsSet[0].selected,
      rollerbearing: this.commonSystemCardsSet[1].selected,
      journalbearing: this.commonSystemCardsSet[2].selected,
      ves: this.commonSystemCardsSet[3].selected,
      abs: this.commonSystemCardsSet[4].selected
    });

    /*const arr = this.commonSystemCardsSet.map(opt => {
      return this._fb.control(opt.selected);
    });
    return this._fb.array(arr);*/
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

  private _resetProject() {
    // this._form.reset();
    // this._newProject = new Project();
  }

  ngOnInit() {
    // this._resetFormErrors();
  }

  ngOnDestroy() {
    this._resetProject();
  }

  onValueChanged(data) {

  }

  onChange() {
    if(!this._project)
      return;

    console.log(this._project.projectsetting);

    this.commonSystemCardsSet = this.commonSystemCardsSet.map(item => Object.assign({}, item, {
      selected: this._project.projectsetting.systemoptions[item.value] === true
    }));

    this.commonResultCardsSet = this.commonResultCardsSet.map(item => Object.assign({}, item, {
      selected: this._project.projectsetting.resultoptions[item.value] === true
    }));

    this._form = this._fb.group({
      settings: this.initSettings(),
      results: this.initResults()
    });
  }

  gotoSettings() {
    this._router.navigate(['/rotordyn/settings', this._id]);
  }

  onSubmit() {
    if (!this._form.valid)
      return;

    let model = this._form.value;

    let g = Object.assign({}, this._project.projectsetting, {
      systemoptions: model.settings,
      resultoptions: model.results
    });

    // console.log(g);
    this._projectService.updateSettings(g);
  }
}