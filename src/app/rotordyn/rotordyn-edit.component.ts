import { Component } from '@angular/core';

import { Observable, Subject } from "rxjs";
import { Project, Machine, UIElement } from '../@core/models/shaft';

import { ProjectService } from '../@core/services/project.service';
// import { ProjectDataService } from '../@core/services/project-data.service';

@Component({
  selector: 'rotordyn-editor',
  templateUrl: './rotordyn-edit.component.html',
})
  // styleUrls: ['./rotordyn.component.scss'],
export class RotordynEditComponent {
  _project: Observable<Project>;
  _originalName: string;

  private _errorMessage:string;
  isFullScreen: boolean = false;

  constructor(private _service: ProjectService) {
    this._project = _service.selectedProject;
  }

  select(node: UIElement) {
    // this.selectnode.emit(node);
    this._service.selectNode(node);
  }

  
}
