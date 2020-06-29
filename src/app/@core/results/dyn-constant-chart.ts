import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { ProjectDataService } from '../services/project-data.service';
import { ResponseBody } from '../models/response-body';

@Component({
  selector: 'dyn-constant-chart',
  template: `
    <div class="row" *ngIf="found">
      <div class="col-sm-6 result-card">
        <div class="value" *ngFor="let entry of _entries; let i=index;">
          <p>Response #{{i+1}} <span class="line" [ngStyle]="{'background-color': entry.color}"></span></p>
          <p>measured at: {{entry.position}} m</p>
          <p>direction: <span [innerHtml]="coords(entry.coord)"></span></p>
        </div>
      </div>
    </div>

    <plotly-plot *ngIf="found" [divId]="'div1'" [data]="graph.data" [layout]="graph.layout" [debug]="debug" [config]="config"></plotly-plot>
    <dyn-unb-chart [project]="project" [prefix]="'cte'"></dyn-unb-chart>
    <div class="placeholder" *ngIf="!found">
      <p>No results calculated for Constant response in this project.</p>
      <spinner></spinner>
    </div>
  `,
  styleUrls: ['./charts.scss']
})
export class DynConstantChartComponent implements OnInit, OnDestroy {
  @Input('project') public project: string;
  debug = false;
  themeSubscription: any;
  found = false;

  _entries = [];

  config: any;
  graph: any = {
    data: [],
    layout: { },
  };
  constructor(private _dataService: ProjectDataService,
              private theme: NbThemeService,
              private cdRef:ChangeDetectorRef) {
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

  coords(n) {
    let arr = ['X', 'Z', '&theta;', '&psi;'];
    return arr[n-1];
  }

  ngOnInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.graph.layout = { 
        height: 650,
        title: "Constant Response",
        paper_bgcolor: echarts.bg,
        plot_bgcolor: echarts.bg,
        font: {
          size: 14,
          color: echarts.textColor
        },
        xaxis: {
            title: "Frequency (Hz)"
        },
        yaxis: {
          rangemode: "tozero",
          zeroline: true,
          title: "Displacement (um)",
          type: "log"
        }
      };

      this._dataService.getProjectChart(this.project, 'cte_amplitude')
        .subscribe((result:ResponseBody) => {
          if(result.status == 200) {
            let res = result.data;
            this.cdRef.detectChanges();
            Object.assign(this.graph.layout, res.layout);
            Object.assign(this.graph.data, res.data);
            this._entries = res.entry;
            this.found = true;
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

