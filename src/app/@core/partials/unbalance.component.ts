import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CustomValidators } from '../validators/custom-validators';

import { ModalComponent } from '../../components/modal.component';
import { Observable, Subject } from "rxjs/Rx";
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'result-unbalance',
  templateUrl: 'unbalance.component.html',
})
export class UnbalanceComponent implements ModalComponent {
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

  initPhase() {
    let group = this._fb.group({
      position: ['0'],
      unbalance: ['1'],
      phase: ['0'],
    }, { validator: CustomValidators.ValidateLengthConstraint(+this.length) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['unbalance'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    return group;
  }

  addPhase() {
    const control = <FormArray>this.data.controls['phases'];
    control.push(this.initPhase());
  }

  removePhase(i: number) {
    const control = <FormArray>this.data.controls['phases'];
    control.removeAt(i);
  }

  close() {
    if (this.closingSubject$)
      this.closingSubject$.next(this.data);
  }
}