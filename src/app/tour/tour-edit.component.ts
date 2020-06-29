import { Component, OnInit, AfterViewInit, ElementRef, Host } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { HintService } from 'angular-custom-tour';
import { SimpleLayoutComponent } from '../layout/simple-layout.component';
import { NbMenuService, NbMenuItem } from '@nebular/theme';

import { Project, UIElement, Machine, MachineError } from '../@core/models/shaft';

import { MENU_ITEMS } from '../rotordyn/rotordyn-menu';
import { MOCK_PROJECT } from './mock-store';
// import * as $ from 'jquery';

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
  selector: 'app-tour2',
  templateUrl: './tour-edit.component.html',
  styleUrls: ['./tour.component.scss', './tour-edit.component.scss'],
  providers: [HintService]
})
//, './rotordyn-view.scss'
export class TourEditComponent implements OnInit {
  _project: Project;
  _currentStep = 1;

  editorTools: ITool[] = [
    {title: "Add Section", name: 'sections', component:'', icon:'fa fa-arrows-h' },
    {title: "Add Disc", name: 'discs', component:'', icon:'nb-loop-circled' },
    {title: "Add Inertia", name: 'inertias', component:'', icon:'nb-loop' },
    {title: "Add Roller Bearing", name: 'rollerbearings', component:'', icon:'nb-sunny' },
    {title: "Add Journal Bearing", name: 'journalbearings', component:'', icon:'nb-sunny-circled' },
    {title: "Add Foundation", name: 'foundations', component:'', icon:'fa fa-arrows-v' },
    {title: "Add VES", name: 'ves', component:'', icon:'ion-gear-b' },
    {title: "Add ABS", name: 'abs', component:'', icon:'ion-gear-a' },
  ];
  currentTool: ITool;

  editorOptions: IEdit[] = [];

  txtRatio = 1.86;
  node: UIElement;
  _nposition = 0;
  _nlength = 0;
  _ndiameter = 0;
  _nisSection = false;
  editing = false;

  constructor(private _hint: HintService,
              private _menuService: NbMenuService,
              private _router: Router,
              @Host() private _menu: SimpleLayoutComponent) {

    this.editorOptions = [
      {title: "Undo", name: 'undo', disabled: false, icon: 'fa fa-undo', action: () => {} },
      {title: "Redo", name: 'redo', disabled: false, icon: 'fa fa-undo fa-flip-horizontal', action: () => {} },
      {title: "Reset", name: 'reset', disabled: false, icon: 'fa fa-eraser', action: () => {} },
      {title: "Save", name: 'save', disabled: false, icon: 'fa fa-save', action: () => {} }
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      this.startTour();
    });

    this._hint.showingStep$.subscribe(step => {
      console.log('STEPPY, ', step);
      this._currentStep = step.order

      if(this._currentStep == 3) {
        this.node = this._project.machine.sections[2];
        this._nlength = +this.node.border.w;
        this._ndiameter = +this.node.border.h;
        this._nposition = +this.node.border.x;
        if(this.node['length'] != undefined) {
          this._nposition += this._nlength/2;
        }
        this._nisSection = true;
        this.editing = true;
      }

    });
    this._hint.finish$.subscribe(finish => {
      console.log('Finished, ', finish);
      this._router.navigate(['/tour/part-3']);
    });
  }

  startTour() {
    this._project = Project.Create(MOCK_PROJECT);
    this._menu.changeItems(MENU_ITEMS);
    this._hint.initialize();
  }
}

/*NbMenuComponent.prototype.clearItems = function () {
  items = []
  _this.menuInternalService.resetItems(_this.items);
};*/