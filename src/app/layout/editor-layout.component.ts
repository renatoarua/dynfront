import { Component, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
// import { NbSidebarModule, NbLayoutModule, NbSidebarService } from '@nebular/theme';
import { Router, ActivatedRoute } from "@angular/router";
import { NbMenuService, NbMenuItem } from '@nebular/theme';

import { ProjectService } from '../@core/services/project.service';
import { ProjectDataService } from '../@core/services/project-data.service';

import { CanComponentDeactivate } from '../@core/unsaved.guard';

import { Store } from '@ngrx/store';
import { Project, Machine, UIElement } from '../@core/models/shaft';
import { EditorUpdateMachine, EditorSelectProjectSuccess } from '../@core/store/actions';
import { AppState, CollectionState, EditorState, ProjectStatus } from '../@core/store/models';
import { getProjectStatus, getSelectedProject } from '../@core/store/reducers';

import { DynForm } from '../@core/models/dyn-form';
import { DynToolbarComponent } from '../rotordyn/dyn-toolbar/dyn-toolbar.component';
import { SideModalComponent } from '../components/dyn-side-modal.component';

import { Observable, Subject, Subscription } from "rxjs/Rx";
import { takeWhile } from 'rxjs/operators';

import { MENU_ITEMS } from '../rotordyn/rotordyn-menu';

@Component({
  selector: 'editor-layout',
  templateUrl: './editor-layout.component.html',
  styleUrls: ['./editor-layout.component.scss']
})
export class EditorLayoutComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  @ViewChild(DynToolbarComponent) toolbar: DynToolbarComponent;
  @ViewChild(SideModalComponent) modals: SideModalComponent;
  _project:Observable<Project>;
  _status:Observable<ProjectStatus>;

  _original: Project = new Project();
  _errorMessage:string;

  isFullScreen: boolean = false;

  onConfirm$: Subscription;
  payload: any;

  formModel: DynForm;
  selected: UIElement;
  isEditing: boolean = true;

  txtRatio: string; // bind this to input with ngModel
  txtRatioChanged: Subject<string> = new Subject<string>();

  menu = MENU_ITEMS;
  alive:boolean = true;

  constructor(private _projectDataService: ProjectDataService,
              private _projectService: ProjectService,
              private element: ElementRef,
              private _fb: FormBuilder,
              private _router:Router,
              private menuService: NbMenuService,
              private cdRef:ChangeDetectorRef) {

    this.formModel = new DynForm(_fb);
    this._project = _projectService.selectedProject;
    this._status = _projectService.projectStatus;

    this._projectService.selectedNode$
      .distinctUntilChanged()
      .subscribe((node) => {
        this.selected = node;
      });

    this._project.subscribe((p) => {
      if(p) {
        this._original = p
        // console.log(p);
        this.txtRatio = p.machine.ldratio+'';
        this.formModel.initForm(p);
        // this.cdRef.detectChanges();
      }
    });

    this.txtRatioChanged
      .debounceTime(2000)
      .distinctUntilChanged()
      .subscribe((res) => {
        this.txtRatio = res;
        if(this._original) {
          this.formModel.updateRatio(res);
          this.updateMachine(true);
        }
      });

    this.menuService
      .onItemClick()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data: { tag: string; item: NbMenuItem }) => {
        let tag = data.item.title;
        switch(tag) {
          case 'Dashboard':
            this.goHome();
            break;
          case 'Details':
            this.viewProject();
            break;
          case 'Edit':
            this.editProject();
            break;
          case 'Settings':
            this.settingsProject();
            break;
        }
      });
  }

  public ngOnInit() {
    this.onConfirm$ = this.modals.onConfirm.subscribe(params => this.onConfirm(params));
    this.updateMachine(true);
  }

  ngOnDestroy() {
    this._projectService.closeProject();
    this.onConfirm$.unsubscribe();
  }

  public canDeactivate() {
    return true;
  }

  openModal(item) {
    // console.log(item);
    this.modals.openModal(item);
  }

  onConfirm(load) {
    console.log("2a) modal confirmed");
    this.payload = load;
  }

  // to its original ??? SELECT with id? last saved??
  resetProject() {
    this._projectService.resetProject(); //this._original
  }

  updateMachine(really: boolean) {
    if (!really)
      return;

    let newProject = Machine.Create(<Machine>this.formModel.form.value);
    console.log("5) updateMachine ", newProject);
    this._projectService.updateMachine(newProject);
  }

  saveProject(item: Project) {
    this._projectService.saveProject(item);
    this.formModel.resetForm();
    this.resetProject();
  }

  deleteNode(node: UIElement) {
    // this.formModel.deleteNode(node);
    this.toolbar.deleteNode(node);
  }

  duplicateNode(node: UIElement) {
    const controls = <FormArray>this.formModel.form.controls[node.group];
    let len = controls.length;
    // console.log(len);
    node.groupId = len+1;
    // node['position'] += 35;
    this.toolbar.duplicateNode(node);
  }

  editNode(node: UIElement) {
    this.toolbar.editNode(node);
  }

  parse(num) {
    return parseFloat(num);
  }

  splitSection($event) {
    let node: UIElement = $event['node'];
    let size: number = $event['size'];
    this.toolbar.splitSection(node.groupId, size);
  }

  joinSection($event) {
    let node: UIElement = $event['node'];
    let pos: number = $event['pos'];
    let x = node.groupId;
    let x1 = x + pos;
    this.toolbar.joinSection(x, x1);
  }

  changeRatio(ev:string) {
    this.txtRatioChanged.next(ev);
  }

  onSubmit() {}
  onOpen() {}
  onCancel() {
    console.log("2b) modal cancelled");
  }

  public goHome():void {
    this._router.navigate(['/dashboard']);
  }

  public viewProject():void {
    this._router.navigate(['/rotordyn/view', this._original.projectId]);
  }

  public editProject():void {
    this._router.navigate(['/rotordyn/edit', this._original.projectId]);
  }

  public settingsProject():void {
    this._router.navigate(['/rotordyn/settings', this._original.projectId]);
  }
}