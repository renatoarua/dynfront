import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from './../../../environments/environment';
import { GlobalService } from './global.service';
import { ResponseBody } from '../models/response-body';

@Injectable()
export class StaffService {
  redirectURL = '';
  loggedIn = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private http: HttpClient
  ) {
    this.loggedIn = this.globalService.isLoggedIn();
  }

  public login(username, password) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/staff/login',
        JSON.stringify({
          LoginForm: {
            username: username,
            password: password
          }
        }),
        {
          headers: headers
        }
      )
      .map(response => {
        if (response.success) {
          localStorage.setItem(
            environment.tokenName,
            response.data['access_token']
          );
          this.loggedIn = true;
        } else {
          localStorage.removeItem(environment.tokenName);
          this.loggedIn = false;
        }
        return response;
      })
      .catch(GlobalService.handleError);
  }

  unauthorizedAccess(error: any): void {
    this.logout();
    this.router.navigate(['/login'], {queryParams: {error: error.data.message}});
  }

  logout(): void {
    localStorage.removeItem(environment.tokenName);
    this.loggedIn = false;
  }

  getJWTValue(): any {
    if (this.globalService.isLoggedIn()) {
      const token = GlobalService.getToken();
      return this.jwtHelper.decodeToken(token);
    } else {
      return null;
    }
  }
}