import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { ModalModule } from '../components/modal.module';
import { SharedModule } from '../shared/shared.module';

import { NbDialogService } from '@nebular/theme';

import { ProjectsComponent } from './projects/projects.component';
import { NewProjectComponent } from './new-project.component';

import { BalanceComponent } from './balance/balance-widget.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    ThemeModule,
    SharedModule,
    ModalModule,
  ],
  declarations: [
  	DashboardComponent,
    ProjectsComponent,
    NewProjectComponent,
    BalanceComponent,
  ],
  entryComponents: [ NewProjectComponent ]
})
export class DashboardModule {
}
