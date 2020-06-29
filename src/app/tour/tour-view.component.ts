import { Component, OnInit, AfterViewInit, ElementRef, Host } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { HintService } from 'angular-custom-tour';
import { SimpleLayoutComponent } from '../layout/simple-layout.component';
import { NbMenuService, NbMenuItem } from '@nebular/theme';

import { Project, Machine, MachineError } from '../@core/models/shaft';

import { MENU_ITEMS } from '../rotordyn/rotordyn-menu';
import { MOCK_PROJECT } from './mock-store';
// import * as $ from 'jquery';

@Component({
  selector: 'app-tour4',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour.component.scss'],
  providers: [HintService]
})
//, './rotordyn-view.scss'
export class TourViewComponent implements OnInit {
  _project: Project;
  _currentStep = 1;

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

      if(this._currentStep == 2) {
        
      }

    });
    this._hint.finish$.subscribe(finish => {
      console.log('Finished, ', finish);
    });
  }

  startTour() {
    this._project = Project.Create(MOCK_PROJECT);
    this._menu.changeItems(MENU_ITEMS);
    this._hint.initialize();
  }

  public visualProject():void {
    this._router.navigate(['/tour/part-3']);
  }

  public runProject():void {
    
  }
}

/*NbMenuComponent.prototype.clearItems = function () {
  items = []
  _this.menuInternalService.resetItems(_this.items);
};*/