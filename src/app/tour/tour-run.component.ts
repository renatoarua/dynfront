import { Component, OnInit, AfterViewInit, ElementRef, Host } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { HintService } from 'angular-custom-tour';
import { SimpleLayoutComponent } from '../layout/simple-layout.component';
import { NbMenuService, NbMenuItem } from '@nebular/theme';

import { Project, Machine, MachineError } from '../@core/models/shaft';

import { MENU_ITEMS } from '../rotordyn/rotordyn-menu';
import { DASH_ITEMS } from './dash-menu';
import { MOCK_PROJECT } from './mock-store';
// import * as $ from 'jquery';

@Component({
  selector: 'app-tour3',
  templateUrl: './tour-run.component.html',
  styleUrls: ['./tour.component.scss'],
  providers: [HintService]
})
export class TourRunComponent implements OnInit {
  _project: Project;
  _currentStep = 1;

  _errors = [];

  constructor(private _hint: HintService,
              private _menuService: NbMenuService,
              private _router: Router,
              @Host() private _menu: SimpleLayoutComponent) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.startTour();
    });

    this._hint.showingStep$.subscribe(step => {
      console.log('STEPPY, ', step);
      this._currentStep = step.order

      if(this._currentStep == 3) {
        
      }

    });
    this._hint.finish$.subscribe(finish => {
      console.log('Finished, ', finish);
      this._router.navigate(['/tour/part-2']);
    });
  }

  startTour() {
    this._project = Project.Create(MOCK_PROJECT);
    this._menu.changeItems(MENU_ITEMS);
    this._hint.initialize();
  }
  
}
