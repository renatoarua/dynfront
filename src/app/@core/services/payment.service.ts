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

import { jsonPlans } from '../data/jsonPlans';
import { Observable } from 'rxjs/Rx';

const TIMEOUT = 100;

@Injectable()
export class PaymentService {
  redirectURL = '';
  loggedIn = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loggedIn = this.globalService.isLoggedIn();
  }

  getPlans(timeout) {
    return Observable.of(jsonPlans)
      .delay(timeout || TIMEOUT);
  }

  buyPlan(payload, timeout) {
    return Observable.timer(timeout || TIMEOUT);
  }
  // buyProducts: (payload, cb, timeout) => setTimeout(() => cb(), timeout || TIMEOUT)

  public getAllPlans() {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(
        this.globalService.apiHost + '/payment/plans',
        {
          headers: headers
        }
      )
      .map(response => {
        return response.data;
      })
      .catch(GlobalService.handleError);
  }

  public static getPayTypes(): Array<any> {
    return [
      {
        name: 'Unlimited',
        label: 'Unlimited use during the period',
        value: 1
      },
      {
        name: 'One Project',
        label: 'Unlimited use in one project',
        value: 2
      },
      {
        name: 'Two Repetitions',
        label: 'Limited to 3 runs in a project',
        value: 3
      }
    ];
  }

  public static getPayGroups(): Array<any> {
    return [
      {
        name: 'Monthly',
        label: 'Monthly paid plan',
        value: 1
      },
      {
        name: 'Daily',
        label: 'Daily paid plan',
        value: 2
      },
      {
        name: 'Yearly',
        label: 'Yearly paid plan',
        value: 3
      },
      {
        name: 'Per Use',
        label: 'Per use paid plan',
        value: 4
      }
    ];
  }

}