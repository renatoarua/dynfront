import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray } from "@angular/forms";
import { Subject } from 'rxjs/Rx'

import { ProjectDataService } from '../@core/services/project-data.service';
import { ModalComponent } from '../components/modal.component';

@Component({
    selector: 'new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements ModalComponent, OnInit {
  @Input() public data: FormGroup;

  closingSubject$: Subject<void>;

  get resultData() { return <FormArray>this.data.get('results'); }
  get settingData() { return <FormArray>this.data.get('settings'); }

  // System entry options
  _systemOptions:any = {};

  // System result options
  _resultOptions:any = {};


  constructor(private _projectService:ProjectDataService) {

  }

  // options
  dialogInit(closeDialogSubject: Subject<void>) {
    this.closingSubject$ = closeDialogSubject;
  }

  ngOnInit() {
    this._systemOptions = ProjectDataService.getSystemOptions();
    this._resultOptions = ProjectDataService.getResultOptions();
  }

  close() {
    if (this.closingSubject$)
      this.closingSubject$.next();
  }
}