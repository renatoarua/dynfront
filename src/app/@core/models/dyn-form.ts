import { FormGroup, FormBuilder, Validators, ValidatorFn, FormArray, AbstractControl } from "@angular/forms";

import { Subscription }   from 'rxjs/Subscription';
import { Observable }   from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';

import { ProjectService } from '../services/project.service';
import { ProjectDataService } from '../services/project-data.service';
import { UIElement, Project, Machine, Sections, Discs, Ribs, RollerBearings, JournalBearings, JournalRotations, JournalOptimization, Foundations, VES, Sheet, SheetMaterials, SheetRotations, SheetTranslations, ABS, ResultCampbell } from './shaft';

import { LinkedNode, LinkedList } from './linked-list';

import { SectionComponent } from '../partials/section.component';
import { DiscComponent } from '../partials/disc.component';
import { InertiaComponent } from '../partials/inertia.component';
import { RollerComponent } from '../partials/roller.component';
import { RibComponent } from '../partials/rib.component';
import { FoundationComponent } from '../partials/foundation.component';
import { JournalComponent } from '../partials/journal.component';
import { VesComponent } from '../partials/ves.component';
import { SheetMaterialComponent } from '../partials/sheetmaterial.component';
import { SheetRotationComponent } from '../partials/sheetrotation.component';
import { SheetTranslationComponent } from '../partials/sheettranslation.component';
import { RotationComponent } from '../partials/rotation.component';

import { CustomValidators } from '../validators/custom-validators'

export class DynForm {
  _project: Project;
  _form:FormGroup;
  _errorMessage:Subject<string>;
  formErrors: any;

  _shaft: LinkedList<Sections>;

  get form() {
    return this._form;
  }

  get project() {
    return this._project;
  }

  get shaft() {
    return this._shaft;
  }

  constructor(private _fb: FormBuilder) {

  }

  initForm(project) {
    this._project = project;
    if(!this._project)
      return;

    this._form = this._fb.group({
      machineId: [''],
      ldratio: ['', [Validators.required, CustomValidators.ValidateMin(0)]],

      sections: new FormArray([]),
      discs: new FormArray([]),
      inertias: new FormArray([]),
      rollerbearings: new FormArray([]),
      journalbearings: new FormArray([]),
      foundations: new FormArray([]),
      ves: new FormArray([]),
      abs: new FormArray([]),

    });

    this.resetFormDataWithProject();
  }

  resetForm() {
    this._form.reset();
  }

  setFormErrors(errorFields: any): void {
    for (let key in errorFields) {
      let errorField = errorFields[key];
      // skip loop if the property is from prototype
      if (!this.formErrors.hasOwnProperty(key)) continue;

      // let message = errorFields[error.field];
      this.formErrors[key].valid = false;
      this.formErrors[key].message = errorField;
    }
  }

  resetFormErrors(): void {
    this.formErrors = {
      ldratio: { valid: true, message: '' },
      sections: [],
      discs: [],
      inertias: [],
      rollerbearings: [],
      journalbearings: [],
      foundations: [],
      ves: [],
      abs: [],
    };
  }

  isValid(field): boolean {
    let isValid: boolean = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.form.controls[field].touched == false) {
      isValid = true;
    }
    // If the field is touched and valid value, then it is considered as valid.
    else if (this.form.controls[field].touched == true && this.form.controls[field].valid == true) {
      isValid = true;
    }

    return isValid;
  }

  resetFormDataWithProject() {
    let machine = this._project.machine;
    this.resetForm();
    this._shaft = new LinkedList<Sections>();

    this._form.controls['machineId'].setValue(machine.machineId);
    // this._form.controls['ldratio'].setValue(+machine.ldratio);
    this.updateRatio(machine.ldratio);

    machine.sections.forEach((item, idx) => {
      this.updateSection(item, idx);
      this._shaft.append(item);
    });
    machine.discs.forEach((item, idx) => {
      this.updateDiscs(item);
    });
    machine.rollerbearings.forEach((item, idx) => {
      this.updateRollerBearings(item);
    });
    machine.journalbearings.forEach((item, idx) => {
      this.updateJournalBearings(item);
    });
    machine.foundations.forEach((item, idx) => {
      this.updateFoundations(item);
    });
    machine.ves.forEach((item, idx) => {
      this.updateVes(item);
    });
  }

  updateRatio(ld) {
    this._form.controls['ldratio'].setValue(ld);
  }

  /****************/
  /*   SECTIONS   */
  /****************/
  initSections(section?: Sections, pos = 0) {
    let ribs = [];
    if(section && section.ribs) {
      section.ribs.forEach((item, idx) => {
        ribs.push( this.initRibs(item) );
      });
    }
    
    // initialize our section
    let group = this._fb.group({
      position: section ? [+section.position] : ['1'],
      externalDiameter: section ? [+section.externalDiameter] : ['1'],
      internalDiameter: section ? [+section.internalDiameter] : ['0'],
      young: section ? [+section.young] : ['210000000000'],
      poisson: section ? [+section.poisson] : ['0.3'],
      density: section ? [+section.density] : ['7850'],
      axialForce: section ? [+section.axialForce] : ['0'],
      magneticForce: section ? [+section.magneticForce] : ['0'],
      insertAt: [pos],
      ribs: new FormArray(ribs),
    }, { validator: CustomValidators.ValidateDiameterConstraint });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['externalDiameter'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['internalDiameter'].setValidators([CustomValidators.ValidatePositive()]);
    group.controls['young'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['poisson'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['density'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['magneticForce'].setValidators([CustomValidators.ValidatePositive()]);
    return group;
  }

  updateSectionsSplit() {
    const control = <FormArray>this._form.controls['sections'];
    while (control.length !== 0) {
      control.removeAt(0);
    }

    let arr = this._shaft.toArray();
    arr.forEach((item, idx) => {
      control.push(this.initSections(item, idx));
    });
  }

  insertSection(data) {
    // Machine.Create(<Machine>this.formModel.form.value);
    let sec = <Sections>data.value;
    let secat = sec['insertAt'];
    const control = <FormArray>this._form.controls['sections'];

    while (control.length !== 0) {
      control.removeAt(0);
    }

    this._shaft.insert(new Sections(sec), secat);

    // console.log(this._shaft.toArray());
    let arr = this._shaft.toArray();
    let length = 0;
    let previous = 0;

    arr.forEach((item, idx) => {
      item.position += length;
      if(idx == secat) {
        length = item.position;
        item.position += previous;
      }
      previous = item.position;
      control.push(this.initSections(item, idx));
    });

    let idx = secat == 0 ? 0 : secat - 1;
    this.shiftElements(arr[idx].position, sec.position);
  }

  shiftElements(div, length) {
    const discs = <FormArray>this._form.controls['discs'];
    discs.controls.forEach((item:FormGroup, idx) => {
      let pos = item.controls['position'].value;
      if(pos >= div)
        item.controls['position'].setValue(pos + length);
    });

    const rollers = <FormArray>this._form.controls['rollerbearings'];
    rollers.controls.forEach((item:FormGroup, idx) => {
      let pos = item.controls['position'].value;
      if(pos >= div)
        item.controls['position'].setValue(pos + length);
    });

    const journals = <FormArray>this._form.controls['journalbearings'];
    journals.controls.forEach((item:FormGroup, idx) => {
      let pos = item.controls['position'].value;
      if(pos >= div)
        item.controls['position'].setValue(pos + length);
    });

    const fund = <FormArray>this._form.controls['foundations'];
    fund.controls.forEach((item:FormGroup, idx) => {
      let pos = item.controls['position'].value;
      if(pos >= div)
        item.controls['position'].setValue(pos + length);
    });

    const ves = <FormArray>this._form.controls['ves'];
    ves.controls.forEach((item:FormGroup, idx) => {
      let pos = item.controls['position'].value;
      if(pos >= div)
        item.controls['position'].setValue(pos + length);
    });
  }

  getSectionLength(no=-1) {
    let n = this._project.machine.sections.length;
    if(no == 0)
      return 0;
    else if(no > 0)
      n = no;
    return (n > 0) ? +this._project.machine.sections[n-1].position : 0;
  }

  initNewSection(section?: Sections) {
    let len = this.getSectionLength();
    let n = this._project.machine.sections.length;
    return { data: this.initSections(section, n), length: len, editing: false };
  }

  addSection(group) {
    // add section to the shaft section list
    const control = <FormArray>this._form.controls['sections'];
    control.push(this.initSections());
  }

  updateSection(section:Sections, idx) {
    (<FormArray>this._form.controls['sections']).push( this.initSections(section, idx) );
  }

  removeSection(i: number) {
    // remove section from the shaft section list
    const control = <FormArray>this._form.controls['sections'];
    control.removeAt(i);
  }

  /****************/
  /*    DISCS     */
  /****************/
  initDiscs(disc?: Discs, mode='disc') {
    // initialize our disc
    let n = this.getSectionLength(this._project.machine.sections.length);
    let group = this._fb.group({
      position: disc ? [+disc.position] : ['0'],
      externalDiameter: disc ? [+disc.externalDiameter] : ['1'],
      internalDiameter: disc ? [+disc.internalDiameter] : ['0'],
      thickness: disc ? [+disc.thickness] : ['1'],
      density: disc ? [+disc.density] : ['7850'],
      ix: disc ? [+disc.ix] : [''],
      iy: disc ? [+disc.iy] : [''],
      iz: disc ? [+disc.iz] : [''],
      length: disc ? [+disc.length] : ['1'],
      mass: disc ? [+disc.mass] : ['1'],
      mode: [mode],
    }, { validator: [CustomValidators.ValidateDiameterConstraint, CustomValidators.ValidateLengthConstraint(n)] });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['externalDiameter'].setValidators([CustomValidators.ValidatePositive(false)]);
    group.controls['internalDiameter'].setValidators([CustomValidators.ValidatePositive()]);
    group.controls['thickness'].setValidators([CustomValidators.ValidatePositive(false)]);
    group.controls['density'].setValidators([CustomValidators.ValidatePositive(false)]);
    group.controls['ix'].setValidators([CustomValidators.ValidatePositive(false)]);
    group.controls['iy'].setValidators([CustomValidators.ValidatePositive(false)]);
    group.controls['iz'].setValidators([CustomValidators.ValidatePositive(false)]);
    group.controls['length'].setValidators([CustomValidators.ValidatePositive(false)]);
    group.controls['mass'].setValidators([CustomValidators.ValidatePositive(false)]);
    return group;
  }

  addDisc(mode='disc') {
    // add disc to the shaft discs list
    const control = <FormArray>this._form.controls['discs'];
    control.push(this.initDiscs(null, mode));
  }

  updateDiscs(disc:Discs, mode='disc') {
    (<FormArray>this._form.controls['discs']).push( this.initDiscs(disc, mode) );
  }

  removeDisc(i: number) {
    // remove disc from the shaft discs list
    const control = <FormArray>this._form.controls['discs'];
    control.removeAt(i);
  }

  /****************/
  /*    RIBS      */
  /****************/
  initRibs(rib?: Ribs) {
    // initialize our rib
    let group = this._fb.group({
      position: rib ? [+rib.position] : [''],
      number: rib ? [+rib.number] : [''],
      webThickness: rib ? [+rib.webThickness] : [''],
      webDepth: rib ? [+rib.webDepth] : [''],
      flangeThick: rib ? [+rib.flangeThick] : [''],
      flangeWidth: rib ? [+rib.flangeWidth] : [''],
    });

    group.controls['number'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
    group.controls['webThickness'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['webDepth'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['flangeThick'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['flangeWidth'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    return group;
  }

  addRib() {
    // add rib to the shaft ribs list
    const control = <FormArray>this._form.controls['ribs'];
    control.push(this.initRibs());
  }

  updateRibs(rib:Ribs) {
    (<FormArray>this._form.controls['ribs']).push( this.initRibs(rib) );
  }

  removeRib(i: number) {
    // remove rib from the shaft ribs list
    const control = <FormArray>this._form.controls['ribs'];
    control.removeAt(i);
  }

  /*******************/
  /* ROLLER BEARINGS */
  /*******************/
  initRollerBearings(bea?:RollerBearings) {
    // initialize our bearing
    let n = this.getSectionLength(this._project.machine.sections.length);
    let group = this._fb.group({
      position: bea ? [+bea.position] : [''],
      mass: bea ? [+bea.mass] : ['0'],
      inertia: bea ? [+bea.inertia] : ['0'],
      kxx: bea ? [+bea.kxx] : ['0'],
      kxz: bea ? [+bea.kxz] : ['0'],
      kzx: bea ? [+bea.kzx] : ['0'],
      kzz: bea ? [+bea.kzz] : ['0'],
      cxx: bea ? [+bea.cxx] : ['0'],
      cxz: bea ? [+bea.cxz] : ['0'],
      czx: bea ? [+bea.czx] : ['0'],
      czz: bea ? [+bea.czz] : ['0'],
      ktt: bea ? [+bea.ktt] : ['0'],
      ktp: bea ? [+bea.ktp] : ['0'],
      kpt: bea ? [+bea.kpt] : ['0'],
      kpp: bea ? [+bea.kpp] : ['0'],
      ctt: bea ? [+bea.ctt] : ['0'],
      ctp: bea ? [+bea.ctp] : ['0'],
      cpt: bea ? [+bea.cpt] : ['0'],
      cpp: bea ? [+bea.cpp] : ['0'],
    }, {validator: CustomValidators.ValidateLengthConstraint(n) });

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['mass'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['inertia'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['kxx'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['kxz'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['kzx'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['kzz'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['cxx'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['cxz'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['czx'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['czz'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['ktt'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['ktp'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['kpt'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['kpp'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['ctt'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['ctp'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['cpt'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['cpp'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    return group;
  }

  addRollerBearing() {
    // add bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['rollerbearings'];
    control.push(this.initRollerBearings());
  }

  updateRollerBearings(bea:RollerBearings) {
    (<FormArray>this._form.controls['rollerbearings']).push( this.initRollerBearings(bea) );
  }

  removeRollerBearing(i: number) {
    // remove bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['rollerbearings'];
    control.removeAt(i);
  }

  /*******************/
  /*JOURNAL BEARINGS */
  /*******************/
  initJournalBearings(bea?:JournalBearings) {
    // initialize our bearing
    let n = this.getSectionLength(this._project.machine.sections.length);
    let rotations = [];
    if(bea && bea.rotations) {
      bea.rotations.forEach((item, idx) => {
        rotations.push( this.initRotations(item) );
      });
    }

    let opt = [];
    if(bea && bea.optimization) {
      bea.optimization.forEach((item, idx) => {
        opt.push( this.initJournalOpt(item) );
      });
    }

    let mode = (opt.length > 0 && opt[0]['status'] != 'RUN') ? 2 : 1;

    // optimization: bea ? this.initJournalOpt(bea.optimization) : this.initJournalOpt(),
    let group = this._fb.group({
      position: bea ? [+bea.position] : [''],
      mode: [mode],
      rotations: new FormArray(rotations),
      optimization: new FormArray(opt),
    }, {validator: CustomValidators.ValidateLengthConstraint(n)});

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['mode'].setValidators([Validators.required, CustomValidators.JournalMode()]);
    group.controls.mode.markAsDirty();
    group.controls.rotations.markAsDirty();
    group.controls.optimization.markAsDirty();
    return group;
  }

  initRotations(bea?:JournalRotations): FormGroup {
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

  addJournalBearing() {
    // add bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['journalbearings'];
    control.push(this.initRollerBearings());
  }

  updateJournalBearings(bea:JournalBearings) {
    (<FormArray>this._form.controls['journalbearings']).push( this.initJournalBearings(bea) );
  }

  removeJournalBearing(i: number) {
    // remove bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['journalbearings'];
    control.removeAt(i);
  }

  /****************/
  /*  FOUNDATION  */
  /****************/
  initFoundations(fund?: Foundations) {
    // initialize our bearing
    let n = this.getSectionLength(this._project.machine.sections.length);
    let group = this._fb.group({
      position: fund ? [+fund.position] : ['0'],
      mass: fund ? [+fund.mass] : ['1'],
      kxx: fund ? [+fund.kxx] : ['1'],
      kzz: fund ? [+fund.kzz] : ['1'],
      cxx: fund ? [+fund.cxx] : ['0'],
      czz: fund ? [+fund.czz] : ['0'],
    }, {validator: CustomValidators.ValidateLengthConstraint(n)});

    group.controls['position'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['mass'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['kxx'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['kzz'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
    group.controls['cxx'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    group.controls['czz'].setValidators([Validators.required, CustomValidators.ValidatePositive()]);
    return group;
  }

  addFoundation() {
    // add bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['foundations'];
    control.push(this.initFoundations());
  }

  updateFoundations(fund: Foundations) {
    (<FormArray>this._form.controls['foundations']).push( this.initFoundations(fund) );
  }

  removeFoundation(i: number) {
    // remove bearing to the shaft bearings list
    const control = <FormArray>this._form.controls['foundations'];
    control.removeAt(i);
  }

  /****************/
  /*     VES      */
  /****************/
  initVes(vs?: VES) {
    // initialize our ves
    let bearings = []
    if(vs && vs.rollerbearings) {
      vs.rollerbearings.forEach((item, idx) => {
        bearings.push( this.initRollerBearings(item) );
      });
    }
    return this._fb.group({
      position: vs ? [+vs.position] : [''],
      sheet: vs ? this.initSheet(vs.sheet) : this.initSheet(),
      rollerbearings: new FormArray(bearings),
    });
  }

  initMaterial(mat?: SheetMaterials) {
    // initialize our ves
    return this._fb.group({
      go: mat ? mat.go : [1530000, Validators.compose([])],
      goo: mat ? mat.goo : [111000000, Validators.compose([])],
      beta: mat ? mat.beta : [0.396, Validators.compose([])],
      b1: mat ? mat.b1 : [0.0134, Validators.compose([])],
      theta1: mat ? mat.theta1 : [15.1, Validators.compose([])],
      theta2: mat ? mat.theta2 : [171, Validators.compose([])],
      temperature: mat ? mat.temperature : [300, Validators.compose([])],
      temperatureRef: mat ? mat.temperatureRef : [273, Validators.compose([])],
    });
  }

  initSheetRotation(rot?: SheetRotations, inertia?) {
    // initialize our ves
    return this._fb.group({
      thickness: rot ? rot.thickness : [''],
      meanRadius: rot ? rot.meanRadius : [''],
      radius: rot ? rot.radius : [''],
      inertia: inertia ? inertia : [''],
    });
  }

  initSheetTranslation(tra?: SheetTranslations, mass?) {
    // initialize our ves
    return this._fb.group({
      segments: tra ? tra.segments : [''],
      thickness: tra ? tra.thickness : [''],
      diameter: tra ? tra.diameter : [''],
      mass: mass ? mass : [''],
    });
  }

  initSheet(sh?: Sheet) {
    let materials = [];
    let rotations = [];
    let translations = [];
    if(sh) {
      if(sh.materials)
        sh.materials.forEach((item, idx) => {
          materials.push( this.initMaterial(item) );
        });
      if(sh.rotations)
        sh.rotations.forEach((item, idx) => {
          rotations.push( this.initSheetRotation(item, sh.inertia) );
        });
      if(sh.translations)
        sh.translations.forEach((item, idx) => {
          translations.push( this.initSheetTranslation(item, sh.mass) );
        });
    }
    return this._fb.group({
      simple: sh ? sh.simple : [''],
      single: sh ? sh.single : [''],
      type: sh ? sh.type : [''],
      materials: new FormArray(materials),
      translations: new FormArray(translations),
      rotations: new FormArray(rotations),
      mass: sh ? sh.mass : [''],
      inertia: sh ? sh.inertia : [''],
    });
  }

  addVes() {
    // add ves to the shaft ves list
    const control = <FormArray>this._form.controls['ves'];
    control.push(this.initVes());
  }

  updateVes(vs:VES) {
    (<FormArray>this._form.controls['ves']).push( this.initVes(vs) );
  }

  removeVes(i: number) {
    // remove ves from the shaft ves list
    const control = <FormArray>this._form.controls['ves'];
    control.removeAt(i);
  }

  /****************/
  /*     ABS      */
  /****************/
  initAbs(vs?: ABS) {
    // initialize our abs
    return this._fb.group({
      
    });
  }

  addAbs() {
    // add abs to the shaft abs list
    const control = <FormArray>this._form.controls['abs'];
    control.push(this.initAbs());
  }

  updateAbs(vs:ABS) {
    (<FormArray>this._form.controls['abs']).push( this.initAbs(vs) );
  }

  removeAbs(i: number) {
    // remove abs from the shaft abs list
    const control = <FormArray>this._form.controls['abs'];
    control.removeAt(i);
  }
}

