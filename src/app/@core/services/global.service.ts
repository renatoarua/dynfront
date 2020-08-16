import {Injectable} from '@angular/core';

import {environment} from '../../../environments/environment';
import {HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs/internal/observable/throwError';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class GlobalService{
  public apiHost:string;

  public setting:any = {};

  constructor(private jwtHelper: JwtHelperService) {
    // this.apiHost = environment.apiHost;
    if(environment.production == true) {
      this.apiHost = 'http://api.dyntechnologies.net/v1';
    } else {
      this.apiHost = 'http://127.0.0.1:8000/v1';
      // this.apiHost = 'http://api.dyntechnologies.net/v1';
    }
  }

  static getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + GlobalService.getToken()
    });
  }

  static getToken(): any {
    return localStorage.getItem(environment.tokenName);
  }

  static handleError(response: Response | any) {
    console.log(response);
    let errorMessage: any = {};
    // Connection error
    if (response.status === 0) {
      errorMessage = {
        success: false,
        status: 0,
        data: 'Sorry, there was a connection error occurred. Please try again.'
      };
    } else {
      errorMessage = response.error;
    }

    return throwError(errorMessage);
  }

  isLoggedIn(): boolean {
    return this.jwtHelper.isTokenExpired() !== true;
  }

  loadGlobalSettingsFromSessionStorage(): void {
    if (sessionStorage.getItem('backend-setting') !== null) {
      this.setting = JSON.parse(sessionStorage.getItem('backend-setting'));
    }
  }

  /*loadGlobalSettingsFromSessionStorage():void {
    if(localStorage.getItem('backend-setting') != null) {
      this.setting = JSON.parse(localStorage.getItem('backend-setting'));
    }

  }*/
}