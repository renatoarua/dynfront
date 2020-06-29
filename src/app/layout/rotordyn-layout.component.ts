import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
// import { NbSidebarModule, NbLayoutModule, NbSidebarService } from '@nebular/theme';
import { NbMenuService, NbMenuItem } from '@nebular/theme';
import { ProjectService } from '../@core/services/project.service';
import { Project } from '../@core/models/shaft';
import { Observable } from "rxjs";
import { takeWhile } from 'rxjs/operators';
import { MENU_ITEMS } from '../rotordyn/rotordyn-menu';

import { CanComponentDeactivate } from '../@core/unsaved.guard';

@Component({
  selector: 'rotordyn-dashboard',
  templateUrl: './rotordyn-layout.component.html',
})
export class RotordynLayoutComponent implements CanComponentDeactivate {
  menu = MENU_ITEMS;
  private _project:Observable<Project>;
  private _original: Project = new Project();
  private alive:boolean = true;

  constructor(private _router:Router,
              private _projectService: ProjectService,
              private menuService: NbMenuService) {

    this._project = _projectService.selectedProject;
    this._project.subscribe((p) => {
      if(p) {
        this._original = p
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
            this.visualProject();
            break;
          case 'Settings':
            this.settingsProject();
            break;
        }
      });
  }

  public canDeactivate() {
    return true;
  }

  public goHome():void {
    this._router.navigate(['/dashboard']);
  }

  public viewProject():void {
    this._router.navigate(['/rotordyn/view', this._original.projectId]);
  }

  public visualProject():void {
    this._router.navigate(['/rotordyn/edit', this._original.projectId]);
  }

  public settingsProject():void {
    this._router.navigate(['/rotordyn/settings', this._original.projectId]);
  }
}

