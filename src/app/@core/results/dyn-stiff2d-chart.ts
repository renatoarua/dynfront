import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { ProjectDataService } from '../../@core/services/project-data.service';
import { ResponseBody } from '../models/response-body';

@Component({
  selector: 'dyn-stiff2d-chart',
  template: `
    <plotly-plot *ngIf="found" [data]="graph.data" [layout]="graph.layout" [config]="config" class="echart"></plotly-plot>
    <div class="row" *ngIf="found">
      <div class="col-sm-6 form-group">
        <label>Rotations</label>
        <select class="form-control select-primary" id="rotations" (change)="onChange($event.target.value)">
          <option *ngFor="let freq of _rotations" [value]="freq.value" [selected]="">{{freq.label}}</option>
        </select>
      </div>
    </div>
    <div class="placeholder" *ngIf="!found">
      <p>No results calculated for Stiffness Map in this project.</p>
      <spinner></spinner>
    </div>
  `,
})
export class DynStiff2dChartComponent implements OnInit, OnDestroy {
  @Input('project') public project: string;
  debug = false;

  themeSubscription: any;
  found = false;

  _rotations = [];
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
        'toggleSpikelines'        
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
        title: 'Critical Rotations',
        paper_bgcolor: echarts.bg,
        plot_bgcolor: echarts.bg,
        font: {
          size: 14,
          color: echarts.textColor
        },
        xaxis: {
            title: "Stiffness (N/m)",
            type: "log"
        },
        yaxis: {
          rangemode: 'tozero',
          zeroline: true,
          title: "Natural Frequency (Hz)"
        }
      };

      this._dataService.getProjectChart(this.project, 'critical2d')
        .subscribe((result:ResponseBody) => {
          if(result.status == 200) {
            let res = result.data;
            this.allData = res;
            Object.assign(this.graph.layout, res.layout);
            Object.assign(this.graph.data, res.data);
            this.found = true;
            this._rotations = [];
            this.allData['rotations'].map((item, idx) => {
              this._rotations.push({
                value: idx,
                label: "Rotation #"+(idx+1)+" - "+item.toFixed(1)+" rpm"
              });
            });
          }
        });
    });
  }

  onChange(newMode) {
    // let size = this.allData.rotations.length;
    let num = this.allData.numCrit;
    let idx = +newMode * num;
    
    let newData = this.allData['frequencies'].slice(idx, idx+num);
    newData.map((item) => {
      item['x'] = this.allData['baseline'];
      return item;
    });

    // console.log(newData)

    Object.assign(this.graph.data, newData);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

