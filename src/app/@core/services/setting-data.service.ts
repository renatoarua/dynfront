import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from './global.service';
import {Setting} from '../models/setting';
import {StaffService} from './staff.service';
import {ResponseBody} from '../models/response-body';

@Injectable()
export class SettingDataService {
  constructor(
    private globalService: GlobalService,
    private staffService: StaffService,
    private http: HttpClient
  ) {
  }

  public static getMetaTypes(): Array<any> {
    return [
      {
        label: 'Select',
        value: 'select'
      },
      {
        label: 'Number',
        value: 'number'
      },
      {
        label: 'Text',
        value: 'text'
      }
    ];
  }

  public static getIsPublicTypes(): Array<any> {
    return [
      {
        label: 'Public',
        value: 1
      },
      {
        label: 'Private',
        value: 0
      }
    ];
  }

  // POST /v1/setting
  addSetting(setting: Setting): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/setting',
        JSON.stringify(setting),
        {
          headers: headers
        }
      )
      .map(response => {
        return response;
      })
      .catch(GlobalService.handleError);
  }

  // DELETE /v1/setting/1
  deleteSettingById(id: number): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .delete<ResponseBody>(this.globalService.apiHost + '/setting/' + id, {
        headers: headers
      })
      .map(response => {
        return response;
      })
      .catch(GlobalService.handleError);
  }

  // PUT /v1/setting/1
  updateSettingById(setting: Setting): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .put<ResponseBody>(
        this.globalService.apiHost + '/setting/' + setting.id,
        JSON.stringify(setting),
        {
          headers: headers
        }
      )
      .map(response => {
        return response;
      })
      .catch(GlobalService.handleError);
  }

  // GET /v1/setting
  getAllSettings(): Observable<Setting[]> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(
        this.globalService.apiHost + '/setting?sort=meta_key',
        {
          headers: headers
        }
      )
      .map(response => {
        return <Setting[]>response.data;
      })
      .catch(GlobalService.handleError);
  }

  refreshGlobalSettings(): void {
    // get settings
    this.globalService.loadGlobalSettingsFromSessionStorage();

    this.getAllSettingsPublic().subscribe(settings => {
      settings.forEach(setting => {
        switch (setting.meta_type) {
          case 'select':
          case 'text':
            this.globalService.setting[setting.meta_key] = setting.meta_value;
            break;
          case 'number':
            this.globalService.setting[setting.meta_key] = +setting.meta_value;
            break;
        }
        sessionStorage.setItem(
          'backend-setting',
          JSON.stringify(this.globalService.setting)
        );
      });
      // this.refreshUserSettings();
    });
  }

   refreshUserSettings(): Promise<any> {
    // get settings
    let promise = new Promise((resolve, reject) => {
      this.getAllMySettings()
        .subscribe((settings) => {
          settings.forEach(setting => {
            switch (setting.meta_type) {
              case 'select':
              case 'text':
                this.globalService.setting[setting.meta_key] = setting.meta_value;
                break;
              case 'number':
                this.globalService.setting[setting.meta_key] = +setting.meta_value;
                break;
            }
            sessionStorage.setItem(
              'backend-setting',
              JSON.stringify(this.globalService.setting)
            );
          });
          resolve();
        }, (error) => {
          reject();
        });
    });
    return promise;
  }

  // GET /v1/setting/public
  getAllSettingsPublic(): Observable<Array<any>> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/setting/public', {
        // headers: headers
      })
      .map(response => {
        return <Array<any>>response.data;
      })
      .catch(GlobalService.handleError);
  }

  // GET /v1/setting/me
  getAllMySettings(): Observable<Array<any>> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/setting/me', {
        headers: headers
      })
      .map(response => {
        return <Array<any>>response.data;
      })
      .catch(GlobalService.handleError);
  }

  // PUT /v1/setting/1
  updateMySettingById(setting: any): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/setting/me-update/' + setting.id,
        JSON.stringify(setting),
        {
          headers: headers
        }
      )
      .map(response => {
        return response;
      })
      .catch(GlobalService.handleError);
  }

  getSettingById(id: number): Observable<Setting> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/setting/' + id, {
        headers: headers
      })
      .map(response => {
        return <Setting>response.data;
      })
      .catch(GlobalService.handleError);
  }

}