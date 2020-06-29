import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { ProjectDataService } from '../services/project-data.service';
import { ResponseBody } from '../models/response-body';

@Component({
  selector: 'dyn-campbell3d-chart',
  template: `
    <plotly-plot *ngIf="found" [data]="graph.data" [layout]="graph.layout" [config]="config"></plotly-plot>
    <dyn-estabilities-chart [project]="project"></dyn-estabilities-chart>
    <div class="placeholder" *ngIf="!found">
      <p>No results calculated for Campbell diagram in this project.</p>
      <spinner></spinner>
    </div>
  `,
})
export class DynCampbell3DChartComponent implements OnInit, OnDestroy {
  @Input('project') public project: string;
  themeSubscription: any;
  found = false;

  config: any;
  graph: any = {
    data: [],
    layout: {},
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
        title: 'Campbell Diagram',
        paper_bgcolor: echarts.bg,
        plot_bgcolor: echarts.bg,
        font: {
          size: 14,
          color: echarts.textColor
        },
        scene: {
          xaxis: {
            title: "Frequency (Hz)",
            gridcolor: 'rgb(255, 255, 255)',
          },
          yaxis: {
            title: "Speed (rpm)",
            gridcolor: 'rgb(255, 255, 255)',
          },
          zaxis: {
            title: "Natural Frequency (Hz)",
            gridcolor: 'rgb(255, 255, 255)',
          },
          aspectratio: { 
            x:1, y:1, z:0.7
          },
          aspectmode: 'manual'
        }
      };

      this._dataService.getProjectChart(this.project, 'campbell3d')
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

