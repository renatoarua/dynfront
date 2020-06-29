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
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss', './projects-list.scss'],
  providers: [HintService]
})
export class TourComponent implements OnInit {
  _project: Project;
  _currentStep = 1;

  constructor(private _hint: HintService,
              private _menuService: NbMenuService,
              private _router: Router,
              @Host() private _menu: SimpleLayoutComponent) {
  }

  ngOnInit() {
    // this._menuService.addItems(MENU_ITEMS);
    setTimeout(() => {
      // this._menu.changeItems(DASH_ITEMS);
      this.startTour();
    });

    this._hint.showingStep$.subscribe(step => {
      console.log('STEPPY, ', step);
      this._currentStep = step.order

      if(this._currentStep == 3) {
        this.createSampleProject();
      }

    });
    this._hint.finish$.subscribe(finish => {
      console.log('Finished, ', finish);
      this._router.navigate(['/tour/part-2']);
    });
  }

  startTour() {
    this._menu.changeItems(DASH_ITEMS);
    this._hint.initialize();
  }

  createSampleProject() {
    this._project = Project.Create(MOCK_PROJECT);
    // this._hint.showNext();
  }
}

/*NbMenuComponent.prototype.clearItems = function () {
  items = []
  _this.menuInternalService.resetItems(_this.items);
};*/