import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TourComponent } from './tour.component';

import { TourEditComponent } from './tour-edit.component';
import { TourRunComponent } from './tour-run.component';
import { TourViewComponent } from './tour-view.component';

const routes: Routes = [
  {
  	path: '',
  	redirectTo: 'part-1',
  	pathMatch: 'full'
  },
  {
    path: 'part-1',
    component: TourComponent,
    data: {
      title: 'Tour'
    }
  },
  {
    path: 'part-2',
    component: TourEditComponent,
    data: {
      title: 'Edit'
    }
  },
  {
    path: 'part-3',
    component: TourRunComponent,
    data: {
      title: 'Run'
    }
  },
  {
    path: 'part-4',
    component: TourViewComponent,
    data: {
      title: 'View'
    }
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TourRoutingModule {
}
