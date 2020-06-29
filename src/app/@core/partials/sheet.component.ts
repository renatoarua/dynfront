import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Subject } from 'rxjs'
import { ModalComponent } from '../../components/modal.component';

@Component({
    selector: 'sheet',
    templateUrl: 'sheet.component.html',
})
export class SheetComponent implements ModalComponent, OnInit {
  @Input() public data: FormGroup;
	closingSubject$: Subject<void>;

	_compTypes: any;
  _singleTypes: any;
  _types: any;

  _single: boolean = true;
  _type: string = '';

  constructor(public _fb: FormBuilder) {
    this._compTypes = [{
      'label': 'Simple',
      'value': 0
    },
    {
      'label': 'Combined',
      'value': 1
    }];

    this._singleTypes = [{
      'label': 'Single',
      'value': 0
    },
    {
      'label': 'Multi',
      'value': 1
    }];

    this._types = [{
      'label': 'Translation',
      'value': 0
    },
    {
      'label': 'Rotation',
      'value': 1
    },
    {
      'label': 'Mixed',
      'value': 2
    }];
  }

  ngOnInit() {
    this.changeSingle(this.data.controls['single']);
  }

	checkMaterials(value) {
    const control = <FormArray>this.data.controls['materials'];

    if (control.length <= 0)
      control.push(this.initMaterial());

    if (value == 0 && control.length > 1) {
      // this.removeMaterial();
      control.removeAt(1);
    } else if(value == 1 && control.length < 2) {
      // this.addMaterial();
      control.push(this.initMaterial());
    }

    if (control.length > 2)
      control.removeAt(1);
  }

  changeMaterials(value) {
    this.checkMaterials(value);
  }

  /****************/
  /*   Material   */
  /****************/
  initMaterial() {
    // initialize our ves
    return this._fb.group({
      sheetMaterialId: [''],
      go: [1530000, Validators.compose([])],
      goo: [111000000, Validators.compose([])],
      beta: [0.396, Validators.compose([])],
      b1: [0.0134, Validators.compose([])],
      theta1: [15.1, Validators.compose([])],
      theta2: [171, Validators.compose([])],
      temperature: [300, Validators.compose([])],
      temperatureRef: [273, Validators.compose([])],
    });
  }

  addMaterial() {
    const control = <FormArray>this.data.controls['materials'];
    control.push(this.initMaterial());
  }

  removeMaterial(idx) {
    const control = <FormArray>this.data.controls['materials'];
    control.removeAt(idx);
  }

  changeSingle(value) {
    if(value == 0)
      this._single = true;
    else
      this._single = false;

    this.checkTypes();
  }

  changeType(value) {
    if (value == 0) {
      this._type = "Tr";
    } else if (value == 1) {
      this._type = "Ro";
    } else if (value == 2) {
      this._type = "Mi";
    } else {
      this._type = "";
    }

    this.checkTypes();
  }

  checkTypes() {
    if (this._type == '')
      return;

    const rcontrol = <FormArray>this.data.controls['rotations'];
    const tcontrol = <FormArray>this.data.controls['translations'];
    // what to remove
    this.clearFormArray(rcontrol);
    this.clearFormArray(tcontrol);

    // ATr, ARo, AMi
    if (this._single) {
      this.addTypes(1);
    } else {
      this.addTypes(2);
    }

    // insert mass or inertia
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  addTypes(i: number) {
    const rcontrol = <FormArray>this.data.controls['rotations'];
    const tcontrol = <FormArray>this.data.controls['translations'];

    while (i > 0) {
      if (this._type == 'Tr') {
        tcontrol.push(this.initTranslation());
      }
      if (this._type == 'Ro') {
        rcontrol.push(this.initRotation());
      }
      if (this._type == 'Mi') {
        tcontrol.push(this.initTranslation());
        rcontrol.push(this.initRotation());
      }

      i--;
    }
  }

  /****************/
  /*   Rotation   */
  /****************/
  initRotation() {
    // initialize our ves
    return this._fb.group({
      sheetRotationId: [''],
      thickness: [''],
      meanRadius: [''],
      radius: [''],
      inertia: [''],
    });
  }

  addRotation() {
    const control = <FormArray>this.data.controls['rotations'];
    control.push(this.initMaterial());
  }

  removeRotation(idx) {
    const control = <FormArray>this.data.controls['rotations'];
    control.removeAt(idx);
  }

  /****************/
  /*  Translation */
  /****************/
  initTranslation() {
    // initialize our ves
    return this._fb.group({
      sheetTranslationId: [''],
      segments: [''],
      thickness: [''],
      diameter: [''],
      mass: [''],
    });
  }

  addTranslation() {
    const control = <FormArray>this.data.controls['translations'];
    control.push(this.initMaterial());
  }

  removeTranslation(idx: number) {
    const control = <FormArray>this.data.controls['translations'];
    control.removeAt(idx);
  }

	close() {
		if (this.closingSubject$)
			this.closingSubject$.next();
	}
}