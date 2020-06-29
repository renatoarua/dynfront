import { Component, Input, Output, ViewChild, OnInit, OnDestroy, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

import { Observable }   from 'rxjs/Rx';
import { ProjectService } from '../../@core/services/project.service';
import { ProjectDataService } from '../../@core/services/project-data.service';
import { UIElement, Project, Machine, Sections, Discs, Ribs, RollerBearings, JournalBearings, Foundations, VES, ABS } from '../../@core/models/shaft';

import { DynForm } from '../../@core/models/dyn-form';

// import { MODAL_LIST } from 'modal-list';
import { ModalItem } from '../../components/modal-item';
// import { DynModalComponent } from '../../components/dyn-modal.component';
import { SideModalComponent } from '../../components/dyn-side-modal.component';

import { SectionComponent } from '../../@core/partials/section.component';
import { DiscComponent } from '../../@core/partials/disc.component';
import { InertiaComponent } from '../../@core/partials/inertia.component';
import { RollerComponent } from '../../@core/partials/roller.component';
import { RibComponent } from '../../@core/partials/rib.component';
import { FoundationComponent } from '../../@core/partials/foundation.component';
import { JournalComponent } from '../../@core/partials/journal.component';
import { VesComponent } from '../../@core/partials/ves.component';
import { SheetMaterialComponent } from '../../@core/partials/sheetmaterial.component';
import { SheetRotationComponent } from '../../@core/partials/sheetrotation.component';
import { SheetTranslationComponent } from '../../@core/partials/sheettranslation.component';
import { RotationComponent } from '../../@core/partials/rotation.component';

import { Store } from '@ngrx/store';
import { AppState } from '../../@core/store/models';

export interface ITool {
  title: string;
  name: string;
  component: any;
  icon: string;
  index?: number;
}

export interface IEdit {
  title: string;
  name: string;
  icon: string;
  disabled: boolean;
  action: Function;
}

@Component({
  selector: 'dyn-toolbar',
  templateUrl: './dyn-toolbar.component.html',
  styleUrls: ['./dyn-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynToolbarComponent  implements OnInit, OnDestroy {
  @Input()
  set payload(value) {
    if(value) {
      this.onConfirm(value);
    }
  }
  @Input('formModel') public formModel: DynForm;

  @Output('onChange') changeModel: EventEmitter<any> = new EventEmitter<any>();
  @Output('onModal') modal$: EventEmitter<any> = new EventEmitter<any>();

  isEditing = -1;

  editorTools: ITool[] = [
    {title: "Add Section", name: 'sections', component:SectionComponent, icon:'fa fa-arrows-h' },
    {title: "Add Disc", name: 'discs', component:DiscComponent, icon:'nb-loop-circled' },
    {title: "Add Inertia", name: 'inertias', component:InertiaComponent, icon:'nb-loop' },
    {title: "Add Roller Bearing", name: 'rollerbearings', component:RollerComponent, icon:'nb-sunny' },
    {title: "Add Journal Bearing", name: 'journalbearings', component:JournalComponent, icon:'nb-sunny-circled' },
    {title: "Add Foundation", name: 'foundations', component:FoundationComponent, icon:'fa fa-arrows-v' },
    // {title: "Add VES", name: 'ves', component:VesComponent, icon:'ion-gear-b' },
    // {title: "Add ABS", name: 'abs', component:VesComponent, icon:'ion-gear-a' },
  ];
  currentTool: ITool;

  editorOptions: IEdit[] = [];

  constructor(private _projectDataService: ProjectDataService,
              private _projectService: ProjectService,
              private _fb: FormBuilder) {

    this.editorOptions = [
      {title: "Undo", name: 'undo', disabled: false, icon: 'fa fa-undo', action: () => this._projectService.undo() },
      {title: "Redo", name: 'redo', disabled: false, icon: 'fa fa-undo fa-flip-horizontal', action: () => this._projectService.redo() },
      {title: "Reset", name: 'reset', disabled: false, icon: 'fa fa-eraser', action: () => this._projectService.resetProject() },
      {title: "Save", name: 'save', disabled: false, icon: 'fa fa-save', action: () => this.save() }
    ];

  }

  ngOnInit() {
    // this.initForm();
  }

  ngOnDestroy() {
    // this._command.save(); ??
  }

  onChange() {
    // this.initialized = true;
  }

  save() {
    let newProject = this.formModel.project;
    newProject.machine = Machine.Create(<Machine>this.formModel.form.value);
    console.log("8) save ", newProject);
    this._projectService.save(newProject);
    this.formModel.initForm(newProject);
  }

  deleteNode(node: UIElement) {
    let group = node.group;
    if(node.group == 'inertias')
      group = 'discs';
    const controls = <FormArray>this.formModel.form.controls[group];
    controls.removeAt(node.groupId);
    this.changeModel.emit(true);
  }

  duplicateNode(node: UIElement) {
    let nd;
    switch(node.group) {
      case 'sections':
        /*nd = <Sections>node;
        nd.sectionId = "";
        this.formModel.updateSection(nd);*/
        break;
      case 'discs':
        nd = <Discs>node;
        nd.discId = '';
        nd.position += 35;
        this.formModel.updateDiscs(nd);
        break;
      case 'inertias':
        nd = <Discs>node;
        nd.discId = '';
        nd.position += 35;
        this.formModel.updateDiscs(nd, 'inertia');
        break;
      case 'rollerbearings':
        nd = <RollerBearings>node;
        nd.rollerBearingId = '';
        nd.position += 35;
        this.formModel.updateRollerBearings(nd);
        break;
      case 'journalbearings':
        nd = <JournalBearings>node;
        nd.journalBearingId = '';
        nd.position += 35;
        this.formModel.updateJournalBearings(nd);
        break;
      case 'foundations':
        nd = <Foundations>node;
        nd.foundationId = '';
        nd.position += 35;
        this.formModel.updateFoundations(nd);
        break;
      case 'ves':
        nd = <VES>node;
        nd.vedId = '';
        nd.position += 35;
        this.formModel.updateVes(nd);
        break;
      case 'abs':
        nd = <ABS>node;
        nd.absId = '';
        nd.position += 35;
        this.formModel.updateAbs(nd);
        break;
      default:
        console.log("duplicate error");
    }
    this.changeModel.emit(true);
  }

  splitSection(n, num) {
    let node = this.formModel.shaft.removeAt(n).elem;
    let size = node.border.w / num;

    node.position -= size * (num-1);
    node.border.w = size;
    node.area.d = node.area.d.replace(/h(\d+)\s/gi, 'h'+size+' ');

    this.formModel.shaft.insert(new Sections(node), n);

    for(let i = 1; i < num; i++) {
      node.position += size;
      node.border.w = size;
      this.formModel.shaft.insert(new Sections(node), n+i);
    }

    this.formModel.updateSectionsSplit();
    this.changeModel.emit(true);
  }

  joinSection(x1, x2) {
    let pos = Math.min(x1, x2);

    let node1 = this.formModel.shaft.removeAt(pos).elem;
    let node2 = this.formModel.shaft.removeAt(pos).elem;

    let length = node2.position;
    let total = node1.border.w + node2.border.w;

    node1.position = length;
    node1.border.w = total;
    node1.area.d = node1.area.d.replace(/h(\d+)\s/gi, 'h'+total+' ');

    if(pos >= this.formModel.shaft.length)
      this.formModel.shaft.append(new Sections(node1));
    else
      this.formModel.shaft.insert(new Sections(node1), pos);

    this.formModel.updateSectionsSplit();
    this.changeModel.emit(true);
  }

  editNode(node: UIElement) {
    let group = node.group;
    let tool = this.editorTools.find(x => x.name == group);
    if(tool.name == 'inertias')
      group = 'discs';
    const controls = <FormArray>this.formModel.form.controls[group];
    const elem = <FormGroup>controls.at(node.groupId);
    this.isEditing = node.groupId;

    let data;
    if(tool.name == 'sections') {
        let len = this.formModel.getSectionLength(node.groupId);
        data = { data: elem, length: len, editing: true };
    } else {
      data = elem;
    }

    let mod: ModalItem =  {
      component: tool.component,
      data: data
    };

    this.currentTool = tool;
    this.modal$.emit(mod);
  }

  openModal(tool: ITool) {
    console.log("1) open modal for ", tool.name);
    let mod: ModalItem =  {
      component: tool.component,
      data: this.selectTool(tool.name)
    };
    this.currentTool = tool;
    // this.modals.openModal(mod);
    this.modal$.emit(mod);
  }

  onConfirm(payload) {
    if (!this.currentTool)
      return;

    let name = this.currentTool.name;
    if(name == 'inertias') {
      name = 'discs';
    }

    console.log("3) modal confirmed 2", name);
    this.addTool(name, payload);
    this.currentTool = null;
  }

  selectTool(name: string) {
    switch(name) {
      case 'sections':
        return this.formModel.initNewSection();
      case 'discs':
        return this.formModel.initDiscs(null, 'disc');
      case 'inertias':
        return this.formModel.initDiscs(null, 'inertia');
      case 'rollerbearings':
        return this.formModel.initRollerBearings();
      case 'journalbearings':
        return this.formModel.initJournalBearings();
      case 'foundations':
        return this.formModel.initFoundations();
      case 'ves':
        return this.formModel.initVes();
      case 'abs':
        return this.formModel.initAbs();
      default:
        return this._fb.group({});
    }
  }

  onSubmit() {
    // console.log('onSubmit');
  }

  onOpen() {
    // console.log("fucking testing");
  }

  onCancel() {
    this.currentTool = null;
    console.log('onCancel');
  }

  // editLdratio($ev) {
  //   let ratio = $ev.target.value;
  //   this._form.controls['ldratio'].setValue(+ratio);
  //   // changeRatio.emit(+ratio);
  // }

  doAction(act: IEdit) {
    act.action();
  }

  addTool(name, data) {

    if(name == 'sections' && data.controls['insertAt'].dirty && this.isEditing <= -1) {
      // change all list, remake the control!
      this.formModel.insertSection(data);
      console.log("try to change the sections after this");
    } else {
      const control = <FormArray>this.formModel.form.controls[name];
      if(this.isEditing > -1) {
        // control.at(this.isEditing).patchValue(data);
        // control.removeAt(this.isEditing);
      } else {
        control.push(data);
      }
    }

    console.log("4) add "+ name, data);
    this.changeModel.emit(true);
    this.isEditing = -1;
  }
}