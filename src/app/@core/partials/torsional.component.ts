import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CustomValidators } from '../validators/custom-validators';

import { ModalComponent } from '../../components/modal.component';
import { Observable, Subject } from "rxjs/Rx";
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'result-torsional',
  templateUrl: 'torsional.component.html',
})
export class TorsionalComponent implements ModalComponent {
  _data: FormGroup;
  _showCoord: boolean = true;

  @Input()
  set data(value: {data: FormGroup, showcoord: boolean}) {
    this._data = value.data;
    this._showCoord = value.showcoord;
  }

  closingSubject$: Subject<any>;
  length: number;

  constructor(public _fb: FormBuilder, private _service: ProjectService) {
    _service.sectionLength.subscribe(len => {
      if(len && len > 0) {
        this.length = len;
      }
    });
  }

  initResponse() {
    let group = this._fb.group({
      position: ['0'],
      coord: [''],
    }, { validator: CustomValidators.ValidateLengthConstraint(+this.length) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    return group;
  }

  addResponse() {
    const control = <FormArray>this._data.controls['responses'];
    control.push(this.initResponse());
  }

  removeResponse(i: number) {
    const control = <FormArray>this._data.controls['responses'];
    control.removeAt(i);
  }

  initPhase() {
    let group = this._fb.group({
      position: ['0'],
      tork: ['1'],
      phase: ['0'],
    }, { validator: CustomValidators.ValidateLengthConstraint(+this.length) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['tork'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    return group;
  }

  addPhase() {
    const control = <FormArray>this._data.controls['phases'];
    control.push(this.initPhase());
  }

  removePhase(i: number) {
    const control = <FormArray>this._data.controls['phases'];
    control.removeAt(i);
  }

  close() {
    if (this.closingSubject$)
      this.closingSubject$.next(this._data);
  }
}