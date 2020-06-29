import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { ProjectDataService } from '../services/project-data.service';
import { ResponseBody } from '../models/response-body';

@Component({
  selector: 'dyn-line-chart',
  template: `
    <plotly-plot *ngIf="found" [data]="graph.data" [layout]="graph.layout" [config]="config" class="echart"></plotly-plot>
    <div class="row" *ngIf="found">
      <div class="col-sm-6 result-card">
        <div class="value">
          <p>Rz1</p>
          <p *ngFor="let r of reactions['r1'];">{{r | number:'1.2-2'}}</p>
        </div>
        <div class="value">
          <p>Rz2</p>
          <p *ngFor="let r of reactions['r2'];">{{r | number:'1.2-2'}}</p>
        </div>
        <div class="value">
          <p>Rz3</p>
          <p *ngFor="let r of reactions['r3'];">{{r | number:'1.2-2'}}</p>
        </div>
      </div>
    </div>
    <div class="placeholder" *ngIf="!found">
      <p>No results calculated for Static line in this project.</p>
      <spinner></spinner>
    </div>
  `,
  styleUrls: ['./charts.scss']
})
export class DynLineChartComponent implements OnInit, OnDestroy {
  @Input('project') public project: string;

  themeSubscription: any;
  found = false;
  reactions: any;

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
        title: 'Static Line',
        paper_bgcolor: echarts.bg,
        plot_bgcolor: echarts.bg,
        font: {
          size: 14,
          color: echarts.textColor
        },
        xaxis: {
            title: "Length (m)"
        },
        yaxis: {
          rangemode: 'tozero',
          zeroline: true,
          title: "Displacement (m)"
        }
      };

      this._dataService.getProjectChart(this.project, 'line')
        .subscribe((result:ResponseBody) => {
          if(result.status == 200) {
            let res = result.data;
            Object.assign(this.graph.data, res.data);
            Object.assign(this.graph.layout, res.layout);
            this.found = true;
            this.reactions = res.results;
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

