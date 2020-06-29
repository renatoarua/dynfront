import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalService } from '../services/global.service';
import { ProjectService } from '../services/project.service';
import { ProjectDataService } from '../services/project-data.service';
import { SettingDataService } from '../services/setting-data.service';
import { StaffService } from '../services/staff.service';
import { StaffDataService } from '../services/staff-data.service';
import { UserDataService } from '../services/user-data.service';
import { UserService } from '../services/user.service';
import { PaymentService } from '../services/payment.service';

import { NbDialogService } from '@nebular/theme';

const SERVICES = [
  GlobalService,
  ProjectService,
  ProjectDataService,
  SettingDataService,
  StaffService,
  StaffDataService,
  UserDataService,
  UserService,
  NbDialogService,
  PaymentService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
