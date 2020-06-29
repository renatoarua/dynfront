import { Component, OnInit } from '@angular/core';
// import { AnalyticsService } from './@core/utils/analytics.service';
import { SettingDataService } from "./@core/services/setting-data.service";
import { ProjectService } from './@core/services/project.service';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'app';

  // private analytics: AnalyticsService
  constructor(private _settingDataService: SettingDataService,
              private _service: ProjectService) {
    this._settingDataService.refreshGlobalSettings();
    // this._service.loadProjects()
  }

  ngOnInit(): void {
    // this.analytics.trackPageViews();
  }
}
