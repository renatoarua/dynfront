import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/Rx';

import { StaffService } from './staff.service';
import { ProjectDataService } from './project-data.service';

import { AppState, UIState } from '../store/models';
// import * as fromActions from '../store/actions';

import { BASE_UNITS } from '../models/base-units';

@Injectable()
export class UnitsService {

  constructor(private _store: Store<AppState>,
              private _dataService: ProjectDataService,
              private _staffService: StaffService) {
  }

  public static getUnits(): any {
    let system = 'si';
    let units = {
      'si': {
        'length': {
          label: 'Millimiters',
          symbol: 'mm'
        },
        'pressure': {
          label: 'Pascal',
          symbol: 'Pa'
        },
        'density': {
          label: '',
          symbol: 'kg/m<sup>3</sup>'
        },
        'force': {
          label: 'Newtons',
          symbol: 'N'
        },
        'mass': {
          label: 'Kilograms',
          symbol: 'kg'
        },
        'inertia': {
          label: '',
          symbol: 'kg.m<sup>2</sup>'
        },
        'stiffness': {
          label: '',
          symbol: 'N/m'
        },
        'damping': {
          label: '',
          symbol: 'N.s/m'
        },
        'tiltstiffness': {
          label: '',
          symbol: 'N.m'
        },
        'tiltdamping': {
          label: '',
          symbol: 'N.s.m'
        },
        'spin': {
          label: '',
          symbol: 'rpm'
        },
        'viscosity': {
          label: '',
          symbol: 'Pa.s'
        },
        'unbalance': {
          label: '',
          symbol: 'g.mm'
        },
        'degrees': {
          label: '',
          symbol: '°'
        },
        'frequency': {
          label: '',
          symbol: 'Hz'
        },
        'tork': {
          label: '',
          symbol: 'N.m'
        }
      },
      'imperial': {
        'length': {
          label: 'Inches',
          symbol: 'in'
        },
        'pressure': {
          label: 'Pounds per square inch',
          symbol: 'psi'
        },
        'density': {
          label: '',
          symbol: 'slug/ft<sup>3</sup>'
        },
        'force': {
          label: 'Pounds',
          symbol: 'lb'
        },
        'mass': {
          label: 'Pounds',
          symbol: 'lb'
        },
        'inertia': {
          label: '',
          symbol: 'lb.in<sup>2</sup>'
        },
        'stiffness': {
          label: '',
          symbol: 'N/m'
        },
        'damping': {
          label: '',
          symbol: 'N.s/m'
        },
        'tiltstiffness': {
          label: '',
          symbol: 'ft-lb'
        },
        'tiltdamping': {
          label: '',
          symbol: 'N.s.m'
        },
        'spin': {
          label: '',
          symbol: 'rpm'
        },
        'viscosity': {
          label: '',
          symbol: 'Pa.s'
        },
        'unbalance': {
          label: '',
          symbol: 'g.mm'
        },
        'degrees': {
          label: '',
          symbol: '°'
        },
        'frequency': {
          label: '',
          symbol: 'Hz'
        },
        'tork': {
          label: '',
          symbol: 'ft-lb'
        }
      },
      'cs': []
    };

    return units[system];
  }
}