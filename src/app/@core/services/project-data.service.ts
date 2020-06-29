import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';


import { GlobalService } from './global.service';
import { StaffService } from './staff.service';
import { ResponseBody } from '../models/response-body';
import { throwError } from 'rxjs/internal/observable/throwError';
import { SharedService } from '../../shared/shared.service';

// import { normalize } from 'normalizr';
// import projectSchema from './schema';

// import { Store } from '@ngrx/store';
import { Project, Machine } from '../models/shaft';
import { SearchCriteria } from '../store/models';

@Injectable()
export class ProjectDataService {

  constructor(private globalService: GlobalService,
              private staffService: StaffService,
              private http: HttpClient,
              private _globalService: GlobalService) {
  }

  Run(machineId:string):Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(
        this.getURLList() + '/machine/execute?id=' + machineId,
        { headers: headers }
      )
      .map((response) => {
        return <Project>response.data;
      })
      .catch(GlobalService.handleError);
  }

  updateMachine(machine:Machine):Observable<any> {
    const headers = GlobalService.getHeaders();
    let id = machine.machineId;

    return this.http
      .put<ResponseBody>(
        this.getURLList() + '/machine/' + id,
        JSON.stringify(machine),
        { headers: headers }
      )
      .map((response) => {
        return <Project>response.data;
      })
      .catch(GlobalService.handleError);
  }

  deleteMachineById(machineId:string):Observable<any> {
    return new Observable();
  }

  updateMachineById(machineId:string):Observable<any> {
    return new Observable();
  }

  resetMachine(machineId:string):Observable<any> {
    return new Observable();
  }

  getProjectById(projectId:string): Observable<Project> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(
        this.getURLList() + '/project/' + projectId,
        { headers: headers }
      )
      .map((response) => {
        return <Project>response.data;
      })
      .catch(GlobalService.handleError);
  }

  // GET /v1/project
  loadProjects(criteria: SearchCriteria): Observable<Project[]> {
    const headers = GlobalService.getHeaders();
    // console.log(criteria.userId);
    // const unit = this._globalService.setting['units'];
    // +'&unit='+this._globalService.setting['units']
    return this.http.get<ResponseBody>(
      this.getURLList() + '/project?sort=-id&userId='+criteria.userId,
      {
        headers: headers 
      })
      .map(response => <Project[]>response.data)
      .catch(GlobalService.handleError);
      //console.log(normalize(response.data, projectSchema));
  }

  createProject(project:Project): Observable<Project> {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.getURLList() + '/project',
        JSON.stringify(project),
        { headers: headers }
      )
      .map((response) => {
        return <Project>response.data;
      })
      .catch(GlobalService.handleError);
  }

  updateProject(project:Project) {
    const headers = GlobalService.getHeaders();

    return this.http
      .put<ResponseBody>(
        this.getURLList() + '/project/' + project.projectId,
        JSON.stringify(project),
        { headers: headers }
      )
      .map((response) => {
        console.log("9b) server response ", <Project>response.data);
        return <Project>response.data;
      })
      .catch(GlobalService.handleError);
      // .subscribe(action => this._store.dispatch({ type: 'UPDATE_PROJECT', payload: project }));
  }

  deleteProject(project:Project) {
    const headers = GlobalService.getHeaders();

    this.http
      .delete<ResponseBody>(
        this.getURLList() + '/project/' + project.projectId,
        { headers: headers }
      )
      // .subscribe(action => this._store.dispatch({ type: 'DELETE_PROJECT', payload: project }));
  }

  getProjectChart(projectId: string, name: string) {
    // return this.http.get(`/assets/uploads/results/${projectId}/${name}.json`).toPromise();
    const headers = GlobalService.getHeaders();
    return this.http
      .get<ResponseBody>(
        this.getURLList() + '/project/' + projectId + '/' + name,
        { headers: headers }
      )
      .map((response) => {
        return response;
      })
      .catch(GlobalService.handleError);
  }

  private handleChartError(response: any) {
    let errorMessage: any = {};
    return Observable.of(errorMessage);
  }

  private getURLList() {
    return this.globalService.apiHost;
  }

  public static getSettingTypes():Array<any> {
    return [
      {
        label: 'System Options',
        value: 10
      },
      {
        label: 'Result Options',
        value: 25
      },
      {
        label: 'General Options',
        value: 0
      }
    ];
  }

  public static getMetaTypes():Array<any> {
    return [
      {
        label: 'Select',
        value: 'select'
      },
      {
        label: 'Number',
        value: 'number'
      },
      {
        label: 'Text',
        value: 'text'
      },
      {
        label: 'Boolean',
        value: 'bool'
      }
    ];
  }

  public static getProjectStatuses():Array<any> {
    return [
      {
        label: 'Active',
        value: 'ACT'
      },
      {
        label: 'Removed',
        value: 'REM'
      },
      {
        label: 'Complete',
        value: 'RUN'
      },
      {
        label: 'Error',
        value: 'ERR'
      }
    ];
  }

  public static getSystemOptions():Array<any> {
    return [
      {
        label: 'Roller Bearings',
        value: 'rollerbearing',
        iconClass: 'nb-lightbulb',
        type: 'warning',
        selected: false
      },
      {
        label: 'Journal Bearings',
        value: 'journalbearing',
        iconClass: 'nb-lightbulb',
        type: 'warning',
        selected: false
      },
      {
        label: 'Foundation',
        value: 'foundation',
        iconClass: 'nb-lightbulb',
        type: 'warning',
        selected: false
      }
      /*,
      {
        label: 'Visco-Elastic Support',
        value: 'ves',
        iconClass: 'nb-lightbulb',
        type: 'warning',
        selected: false
      },
      {
        label: 'Absorbtion Support',
        value: 'abs',
        iconClass: 'nb-lightbulb',
        type: 'warning',
        selected: false
      }*/
    ];
  }

  public static getResultOptions():Array<any> {
    return [
      {
        label: 'Line',
        value: 'staticLine',
        iconClass: 'nb-lightbulb',
        type: 'primary',
        category: 'static',
        selected: false
      },
      /*{
        label: 'Fatigue',
        value: 'fatigue',
        iconClass: 'nb-lightbulb',
        type: 'primary',
        category: 'static',
        selected: false
      },*/
      {
        label: 'Campbell Diagram',
        value: 'campbell',
        iconClass: 'nb-lightbulb',
        type: 'primary',
        category: 'modal',
        selected: false
      },
      {
        label: 'Stiffness Map',
        value: 'criticalMap',
        iconClass: 'nb-lightbulb',
        type: 'primary',
        category: 'modal',
        selected: false
      },
      {
        label: 'Modes',
        value: 'modes',
        iconClass: 'nb-lightbulb',
        type: 'primary',
        category: 'modal',
        selected: false
      },
      {
        label: 'Unbalance',
        value: 'unbalanceResponse',
        iconClass: 'nb-lightbulb',
        type: 'primary',
        category: 'response',
        selected: false
      },
      {
        label: 'Constant',
        value: 'constantResponse',
        iconClass: 'nb-lightbulb',
        type: 'primary',
        category: 'response',
        selected: false
      },
      {
        label: 'Time',
        value: 'timeResponse',
        iconClass: 'nb-lightbulb',
        type: 'primary',
        category: 'response',
        selected: false
      },
      {
        label: 'Torsional Analisys',
        value: 'torsional',
        iconClass: 'nb-lightbulb',
        type: 'primary',
        category: 'dynamic',
        selected: false
      },
      /*{
        label: 'Balance',
        value: 'balanceOptimization',
        iconClass: 'nb-lightbulb',
        type: 'success',
        category: 'optimization',
        selected: false
      },
      {
        label: 'Visco-Elastic Support',
        value: 'vesOptimization',
        iconClass: 'nb-lightbulb',
        type: 'success',
        category: 'optimization',
        selected: false
      },
      {
        label: 'Absorbtion Support',
        value: 'absOptimization',
        iconClass: 'nb-lightbulb',
        type: 'success',
        category: 'optimization',
        selected: false
      }*/
    ];
  }
}
