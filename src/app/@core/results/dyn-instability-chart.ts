import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { ProjectDataService } from '../../@core/services/project-data.service';
import { ResponseBody } from '../models/response-body';

@Component({
  selector: 'dyn-instability-chart',
  template: `
    <plotly-plot *ngIf="found" [data]="graph.data" [layout]="graph.layout" [config]="config"></plotly-plot>
  `,
})
export class DynInstabilityChartComponent implements OnInit, OnDestroy {
  @Input('project') public project: string;

  themeSubscription: any;
  found = false;

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
        title: 'Instability Map',
        paper_bgcolor: echarts.bg,
        plot_bgcolor: echarts.bg,
        font: {
          size: 14,
          color: echarts.textColor
        },
        xaxis: {
            title: "Speed (rpm)"
        },
        yaxis: {
          rangemode: 'tozero',
          zeroline: true,
          title: "Eigenvalues (real part)"
        }
      };

      this._dataService.getProjectChart(this.project, 'instabilities')
        .subscribe((result:ResponseBody) => {
          if(result.status == 200) {
            let res = result.data;
            Object.assign(this.graph.data, res.data);
            Object.assign(this.graph.layout, res.layout);
            this.found = true;
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

