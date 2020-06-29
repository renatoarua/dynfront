import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { ProjectDataService } from '../../@core/services/project-data.service';
import { ResponseBody } from '../models/response-body';

interface chartConfig {
  type: string;
  layout: any;
}

@Component({
  selector: 'dyn-unb-chart',
  template: `
    <plotly-plot *ngIf="found" [data]="graph.data" [layout]="graph.layout" [config]="config" class="echart"></plotly-plot>
  `,
})
export class DynUnbChartComponent implements OnInit, OnDestroy {
  @Input('project') public project: string;
  @Input('prefix') public prefix: string;

  restype = 'unbalance';
  extendLayout = {};

  @Input('type')
  set type(value: chartConfig) {
    if(value) {
      this.restype = value.type;
      this.extendLayout = value.layout;
      // Object.assign(this.graph.layout, value.layout);
    }
  }

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

      this.graph.layout = Object.assign({}, {
        height: 650,
        title: 'Phase',
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
          title: "Phase (º)",
          type: "linear"
        }
      },
      this.extendLayout);

      this._dataService.getProjectChart(this.project, this.prefix+'_'+this.restype)
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

