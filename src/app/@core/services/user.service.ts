import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Observable, Subject } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

import { environment } from './../../../environments/environment';
import { ResponseBody } from '../models/response-body';
import { GlobalService } from './global.service';
import { UserDataService } from './user-data.service';

import { User } from '../models/user';
import { AppState, AppStatus, UIState } from '../store/models';
import { getUIStatus, getUser, getError, hasUser, isLoading } from '../store/reducers';
import * as fromActions from '../store/actions';

@Injectable()
export class UserService {
  redirectURL = '';
  loggedIn = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private http: HttpClient,
    private _store: Store<AppState>,
    private _dataService: UserDataService,
  ) {
    this.loggedIn = this.isLoggedIn();
  }

  get appStatus(): Observable<AppStatus> {
    return this._store.select(getUIStatus);
  }

  get me(): Observable<User> {
    return this._store.select(getUser);
  }

  get loading(): Observable<boolean> {
    return this._store.select(isLoading);
  }

  getMe() {

    this._store.dispatch(new fromActions.UIGetUser(0));
    this._dataService.getMe()
      .map(payload => new fromActions.UIGetUserSuccess(payload))
      .subscribe((action) => {
        this._store.dispatch(action);
      },
      (error) => { 
        console.log(error);
        this._store.dispatch(new fromActions.UIGetUserFailure(error));
      });
  }

  public login(username, password) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/login',
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

  public signup(username, email, password) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/signup',
        JSON.stringify({
          SignupForm: {
            username: username,
            email: email,
            password: password
          }
        }),
        {headers: headers}
      )
      .map(response => {
        if (response.success) {
        } else {
        }
        return response;
      })
      .catch(GlobalService.handleError);
  }

  public signupConfirm(id, auth_key) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/confirm',
        JSON.stringify({
          SignupConfirmForm: {
            id: id,
            auth_key: auth_key
          }
        }),
        {headers: headers}
      )
      .map(response => {
        if (response.success) {
        } else {
        }
        return response;
      })
      .catch(GlobalService.handleError);
  }

  public passwordResetRequest(email) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/password-reset-request',
        JSON.stringify({
          PasswordResetRequestForm: {
            email: email
          }
        }),
        {headers: headers}
      )
      .map(response => {
        if (response.success) {
        } else {
        }
        return response;
      })
      .catch(GlobalService.handleError);
  }

  public passwordResetTokenVerification(token) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/password-reset-token-verification',
        JSON.stringify({
          PasswordResetTokenVerificationForm: {
            token: token
          }
        }),
        {headers: headers}
      )
      .map(response => {
        if (response.success) {
        } else {
        }
        return response;
      })
      .catch(GlobalService.handleError);
  }

  public passwordReset(token, password) {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(
        this.globalService.apiHost + '/user/password-reset',
        JSON.stringify({
          PasswordResetForm: {
            token: token,
            password: password
          }
        }),
        {headers: headers}
      )
      .map(response => {
        if (response.success) {
        } else {
        }
        return response;
      })
      .catch(GlobalService.handleError);
  }

  public logout(): void {
    localStorage.removeItem(environment.tokenName);
    this.loggedIn = false;
  }

  public getToken(): any {
    return localStorage.getItem(environment.tokenName) || '';
  }

  public unauthorizedAccess(error: any): void {
    this.logout();
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return this.jwtHelper.isTokenExpired(this.getToken()) !== true;
  }

  public getJWTValue(): any {
    if (this.isLoggedIn()) {
      const token = this.getToken();
      return this.jwtHelper.decodeToken(token);
    } else {
      return null;
    }
  }

}
