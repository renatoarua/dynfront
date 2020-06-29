import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { ProjectDataService } from '../services/project-data.service';
import { ResponseBody } from '../models/response-body';

import * as Plotlyjs from 'plotly.js/dist/plotly.min.js';

@Component({
  selector: 'dyn-time-chart',
  template: `<div #plot id="time-plot" style="width: 100%; height: 100%;"></div>`
  /*template: `
    <plotly-plot *ngIf="found" [data]="graph.data" [layout]="graph.layout" [config]="config" class="echart"></plotly-plot>
    <div *ngIf="!found"><p>No results calculated for Time Response in this project.</p></div>
  `,*/
})
export class DynTimeChartComponent implements OnInit, OnDestroy {
  @Input('project') public project: string;
  plotly: any;

  themeSubscription: any;
  found = false;

  _freqs = [];
  allData: any;

  config: any;
  graph: any = {
    data: [],
    layout: {},
  };
  constructor(private _dataService: ProjectDataService, private theme: NbThemeService) {
    this.plotly = Plotlyjs;
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
      displaylogo: false,
      frames: []
    }
  }

  ngOnInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.graph.layout = { 
        height: 650,
        autosize: true,
        title: 'Time Response',
        paper_bgcolor: echarts.bg,
        plot_bgcolor: echarts.bg,
        font: {
          size: 14,
          color: echarts.textColor
        },
        scene: {
          zaxis: {
            range: [-40000, 40000]
          },
          aspectratio: {
            x:3,
            y:1,
            z:1
          }
        }
      };

      this._dataService.getProjectChart(this.project, 'time')
        .subscribe((result:ResponseBody) => {
          if(result.status == 200) {
            let res = result.data;
            this.allData = res;
            Object.assign(this.graph.data, res.data);
            Object.assign(this.graph.layout, res.layout);
            this.found = true;
            this.plotly.plot('time-plot', {
              data: this.graph.data,
              layout: this.graph.layout,
              frames: res.frames,
              config: this.config
            });
          }
        });
    });
  }

  onChange(newFreq) {
    // let idx = +newFreq * this.allData.numOrbits;
    
    // let newData = this.allData['modes'].slice(idx, idx+this.allData.numOrbits);
    // newData.push(this.allData['baseline'][0])

    // Object.assign(this.graph.data, newData);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

