import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validators';
import { Subject } from 'rxjs/Rx'
import { ModalComponent } from '../../components/modal.component';

import { JournalRotations, JournalOptimization } from '../../@core/models/shaft';
import { ProjectService } from '../../@core/services/project.service';

@Component({
    selector: 'shaft-journal',
    templateUrl: 'journal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalComponent implements ModalComponent, OnInit {
  @Input() public data: FormGroup;
  closingSubject$: Subject<any>;

  _units: any = {};

  _modeTypes: any;
  _mode: number = 0;

  constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef) {
    this._modeTypes = [{
      'label': 'None',
      'value': 0
    },
    {
      'label': 'Coeficients - Direct',
      'value': 1
    },
    {
      'label': 'Coeficient Calculation',
      'value': 2
    }];

    this._units = ProjectService.getUnits();
  }

  ngOnInit() {
    this._mode = this.data.get('mode').value;
  }

  changeMode($ev) {
    this._mode = $ev;
    if(this._mode == 2) {
      this.data.controls['rotations'].reset();
      this.addOpt();
    }
    else {
      this.removeOpt(0);
    }
  }

	/*******************/
  /*    ROTATIONS    */
  /*******************/
  initRotations(bea?:JournalRotations) {
    // initialize our bearing
    let group = this._fb.group({
      speed: bea ? [+bea.speed] : ['1'],
      kxx: bea ? [+bea.kxx] : ['0'],
      kxz: bea ? [+bea.kxz] : ['0'],
      kzx: bea ? [+bea.kzx] : ['0'],
      kzz: bea ? [+bea.kzz] : ['0'],
      cxx: bea ? [+bea.cxx] : ['0'],
      cxz: bea ? [+bea.cxz] : ['0'],
      czx: bea ? [+bea.czx] : ['0'],
      czz: bea ? [+bea.czz] : ['0']
    });

    group.controls['speed'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['kxx'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['kxz'].setValidators([Validators.required]);
    group.controls['kzx'].setValidators([Validators.required]);
    group.controls['kzz'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['cxx'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['cxz'].setValidators([Validators.required]);
    group.controls['czx'].setValidators([Validators.required]);
    group.controls['czz'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    return group;
  }

  addRotation() {
    // add bearing to the shaft bearings list
    const control = <FormArray>this.data.controls['rotations'];
    control.push(this.initRotations());
  }

  removeRotation(i: number) {
    // remove bearing to the shaft bearings list
    const control = <FormArray>this.data.controls['rotations'];
    control.removeAt(i);
    // if (control.length <= 0)
    //   this._mode = 0;
  }

  initJournalOpt(opt?: JournalOptimization) {
    let group = this._fb.group({
      initialSpin: opt ? [+opt.initialSpin] : ['0'],
      finalSpin: opt ? [+opt.finalSpin] : ['1'],
      steps: opt ? [+opt.steps] : ['1'],
      viscosity: opt ? [+opt.viscosity] : [''],
      diameter: opt ? [+opt.diameter] : [''],
      length: opt ? [+opt.length] : [''],
      radio: opt ? [+opt.radio] : [''],
      load: (opt && opt.load) ? [+opt.load] : ['0'],
      status: opt ? [opt.status] : ['PEN'],
    }, {validator: CustomValidators.ValidateSpinConstraint});

    group.controls['initialSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['finalSpin'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['steps'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls['viscosity'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['diameter'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['length'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['radio'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    return group;
  }

  addOpt() {
    const control = <FormArray>this.data.controls['optimization'];
    let opt = null;
    if(control.length > 0)
      opt = control.at(0);

    control.push(this.initJournalOpt(opt));
    control.markAsDirty();
    // this.cd.detectChanges();
  }

  removeOpt(i: number) {
    const control = <FormArray>this.data.controls['optimization'];
    control.removeAt(i);
  }

	close() {
		if (this.closingSubject$)
			this.closingSubject$.next(this.data);
	}
}