import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Subject } from 'rxjs'
import { ProjectService } from '../../@core/services/project.service';
import { ModalComponent } from '../../components/modal.component';

@Component({
  selector: 'shaft-ves',
  templateUrl: 'ves.component.html',
})
export class VesComponent implements ModalComponent {
  @Input() public data: FormGroup;
  closingSubject$: Subject<any>;
  _units: any = {};

  constructor(public _fb: FormBuilder) {
    this._units = ProjectService.getUnits();
  }

  ngOnInit() {
    // const control = <FormArray>this.data.controls['materials'];
    // if (control.length <= 0)
    //   control.push(this.initMaterial());
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
    const control = <FormArray>this.data.controls['rollerbearings'];
    control.push(this.initRollerBearings());
  }

  removeRollerBearing(i: number) {
    // remove bearing to the shaft bearings list
    const control = <FormArray>this.data.controls['rollerbearings'];
    control.removeAt(i);
  }

  close() {
    if (this.closingSubject$)
      this.closingSubject$.next(this.data);
  }
}