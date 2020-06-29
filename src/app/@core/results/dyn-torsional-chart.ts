import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { ProjectDataService } from '../services/project-data.service';
import { ResponseBody } from '../models/response-body';

@Component({
  selector: 'dyn-torsional-chart',
  template: `
    <div class="row" *ngIf="found">
      <div class="col-sm-6 result-card">
        <div class="value" *ngFor="let entry of _entries; let i=index;">
          <p>Response #{{i+1}} <span class="line" [ngStyle]="{'background-color': entry.color}"></span></p>
          <p>measured at: {{entry.position}} m</p>
          <p></p>
        </div>
      </div>
    </div>

    <dyn-unb-chart [project]="project" [prefix]="'tor'" [type]="amplitude"></dyn-unb-chart>
    <dyn-unb-chart [project]="project" [prefix]="'tor'"></dyn-unb-chart>
    <plotly-plot *ngIf="found" [data]="graph.data" [layout]="graph.layout" [config]="config" class="echart"></plotly-plot>
    <div class="row" *ngIf="found">
      <div class="col-sm-6 form-group">
        <label>Modes</label>
        <select class="form-control select-primary" id="modes" (change)="onChange($event.target.value)">
          <option *ngFor="let freq of _freqs" [value]="freq.value" [selected]="">{{freq.label}}</option>
        </select>
      </div>
    </div>
    <div class="placeholder" *ngIf="!found">
      <p>No results calculated for Torsional Analisys in this project.</p>
      <spinner></spinner>
    </div>
  `,
  styleUrls: ['./charts.scss']
})
export class DynTorsionalChartComponent implements OnInit, OnDestroy {
  @Input('project') public project: string;

  themeSubscription: any;
  found = false;

  _entries = [];
  _freqs = [];
  allData: any;

  config: any;
  graph: any = {
    data: [],
    layout: { },
  };

  amplitude: any = { type: 'amplitude' };

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
    this.amplitude = Object.assign(this.amplitude, {
      type: 'amplitude',
      layout: {
        title: 'Torsional',
        xaxis: {
          title: "Frequency (Hz)"
        },
        yaxis: {
          title: "Angle (º)",
          type: "log"
        }
      }
    });
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.graph.layout = { 
        showlegend: false,
        height: 650,
        title: 'Torsional Analisys',
        paper_bgcolor: echarts.bg,
        plot_bgcolor: echarts.bg,
        font: {
          size: 14,
          color: echarts.textColor
        },
        scene: {
          aspectratio: { 
            x:0.5, y:1.5, z:0.7
          },
          aspectmode: 'manual'
        }
      };

      this._dataService.getProjectChart(this.project, 'torsion')
        .subscribe((result:ResponseBody) => {
          if(result.status == 200) {
            let res = result.data;
            this.allData = res;
            Object.assign(this.graph.data, res.data);
            Object.assign(this.graph.layout, res.layout);
            this._entries = res.entry;
            this._freqs = [];
            this._freqs = res.frequencies.map((item, idx) => {
              return {
                value: idx,
                label: item
              }
            });
            this.found = true;
          }
        });
    });
  }

  onChange(newMode) {
    let size = 2*this.allData.numPositions-1
    let idx = +newMode * size;
    
    let newData = this.allData['modes'].slice(idx, idx+size);
    newData.push(this.allData['baseline'][0])

    Object.assign(this.graph.data, newData);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

