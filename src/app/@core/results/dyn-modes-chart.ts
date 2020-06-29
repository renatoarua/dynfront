import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { ProjectDataService } from '../services/project-data.service';
import { ResponseBody } from '../models/response-body';

@Component({
  selector: 'dyn-modes-chart',
  template: `
    <plotly-plot *ngIf="found" [data]="graph.data" [layout]="graph.layout" [config]="config" class="echart"></plotly-plot>
    <div class="row" *ngIf="found">
      <div class="col-sm-6 form-group">
        <label>Spin Speed</label>
        <select id="frequency" class="form-control select-primary" (change)="onChange($event.target.value)">
          <option *ngFor="let freq of _modes" [value]="freq.value" [selected]="">{{freq.label}}</option>
        </select>
      </div>
    </div>
    <div class="placeholder" *ngIf="!found">
      <p>No results calculated for Natural Modes of Vibration in this project.</p>
      <spinner></spinner>
    </div>
  `,
  styleUrls: ['./charts.scss']
})
export class DynModesChartComponent implements OnInit, OnDestroy {
  @Input('project') public project: string;

  themeSubscription: any;
  found = false;

  _modes = [];
  allData: any;

  config: any;
  graph: any = {
    data: [],
    layout: { },
  };
  constructor(private _dataService: ProjectDataService, private theme: NbThemeService) {
    this.config = {
      'modeBarButtonsToRemove': [
        'sendDataToCloud',
        'zoom2d',
        'pan2d',
        'select2d',
        'lasso2d',
        'zoomIn2d',
        'zoomOut2d',
        'autoScale2d',
        'resetScale2d',
        'hoverCompareCartesian',
        'hoverClosestCartesian',
        'toggleSpikelines',
        'zoom3d',
        'pan3d',
        'orbitRotation',
        'tableRotation',
        'resetCameraDefault3d',
        'resetCameraLastSave3d',
        'hoverClosest3d'
      ],
      displayModeBar: true,
      displaylogo: false
    }
  }

  ngOnInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.graph.layout = { 
        height: 650,
        title: 'Modes',
        paper_bgcolor: echarts.bg,
        plot_bgcolor: echarts.bg,
        font: {
          size: 14,
          color: echarts.textColor
        },
        scene: {
          aspectmode: 'manual',
          aspectratio: {
            x:3,
            y:1,
            z:1
          }
        }
      };

      this._dataService.getProjectChart(this.project, 'modes')
        .subscribe((result:ResponseBody) => {
          if(result.status == 200) {
            let res = result.data;
            this.allData = res;
            Object.assign(this.graph.data, res.data);
            Object.assign(this.graph.layout, res.layout);
            this.found = true;
            this._modes = res.frequencies.map((item, idx) => {
              return {
                value: idx,
                label: item
              }
            });
            
          }
        });
    });
  }

  onChange(newFreq) {
    let idx = +newFreq * this.allData.numOrbits;
    
    let newData = this.allData['modes'].slice(idx, idx+this.allData.numOrbits);
    newData.push(this.allData['baseline'][0])

    Object.assign(this.graph.data, newData);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

