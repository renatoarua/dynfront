import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { CoreModule } from '../@core/core.module';
import { SharedModule } from '../shared/shared.module';

// tour module
import { HintModule } from 'angular-custom-tour';

import { TourRoutingModule } from './tour-routing.module';
import { TourComponent } from './tour.component';
import { TourEditComponent } from './tour-edit.component';
import { TourRunComponent } from './tour-run.component';
import { TourViewComponent } from './tour-view.component';

import { PlotlyModule } from 'angular-plotly.js';
import { ModalModule } from '../components/modal.module';

@NgModule({
  imports: [
    ThemeModule,
    CoreModule,
    SharedModule,
    TourRoutingModule,
    HintModule,
    ModalModule,
  ],
  declarations: [
  	TourComponent,
    TourEditComponent,
    TourRunComponent,
    TourViewComponent,
  ],
  // entryComponents: [ NewProjectComponent ]
})
export class TourModule {
}