import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CustomValidators } from '../validators/custom-validators';

import { ModalComponent } from '../../components/modal.component';
import { Observable, Subject } from "rxjs/Rx";
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'result-constant',
  templateUrl: 'constant.component.html',
})
export class ConstantComponent implements ModalComponent {
  @Input() public data: FormGroup;
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
      coord: ['1'],
    }, { validator: CustomValidators.ValidateLengthConstraint(+this.length) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    return group;
  }

  addResponse() {
    const control = <FormArray>this.data.controls['responses'];
    control.push(this.initResponse());
  }

  removeResponse(i: number) {
    const control = <FormArray>this.data.controls['responses'];
    control.removeAt(i);
  }

  initForce() {
    let group = this._fb.group({
      position: ['0'],
      force: ['1'],
      coord: ['1'],
    }, { validator: CustomValidators.ValidateLengthConstraint(+this.length) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['force'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    return group;
  }

  addForce() {
    const control = <FormArray>this.data.controls['forces'];
    control.push(this.initForce());
  }

  removeForce(i: number) {
    const control = <FormArray>this.data.controls['forces'];
    control.removeAt(i);
  }

  close() {
    if (this.closingSubject$)
      this.closingSubject$.next(this.data);
  }
}