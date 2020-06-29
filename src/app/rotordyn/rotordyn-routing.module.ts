import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectionGuard } from '../@core/collection.guard';
import { SelectionGuard } from '../@core/selection.guard';
import { UnsavedGuard } from '../@core/unsaved.guard';

import { EditorLayoutComponent } from '../layout/editor-layout.component';
import { RotordynLayoutComponent } from '../layout/rotordyn-layout.component';
// import { CleanLayoutComponent } from '../layout/clean-layout.component';

import { RotordynComponent } from './rotordyn.component';
import { RotordynRunComponent } from './rotordyn-run.component';
import { RotordynDetailComponent } from './rotordyn-detail.component';
import { RotordynEditComponent } from './rotordyn-edit.component';
import { RotordynEdit3dComponent } from './rotordyn-edit3d.component';
import { SettingsComponent } from './project-settings/settings.component';
// import { RotordynListComponent } from './rotordyn-list.component';
// import { RotordynFormComponent } from './rotordyn-form.component';
// import { RotordynCreateComponent } from './rotordyn-create.component';


const routes: Routes = [
  {
    path: '',
    component: RotordynLayoutComponent,
    data: {
        title: 'RotorDYN'
    },
    canActivateChild: [SelectionGuard],
    children: [
      {
        path: 'view/:projectId',
        component: RotordynDetailComponent,
        data: {
          title: 'View'
        }
      },
      {
        path: 'logger/:projectId/:runId',
        component: RotordynRunComponent,
        data: {
          title: 'Logger'
        }
      }
    ]
  },
  {
    path: '',
    component: EditorLayoutComponent,
    data: {
        title: 'RotorDYN'
    },
    canActivateChild: [SelectionGuard],
    // canDeactivate: [UnsavedGuard],
    children: [
      {
        path: 'edit/:projectId',
        component: RotordynEditComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'edit/3d/:projectId',
        component: RotordynEdit3dComponent,
        data: {
          title: 'Edit'
        }
      },
    ]
  },
  {
    path: '',
    component: RotordynLayoutComponent,
    canActivateChild: [SelectionGuard],
    // canDeactivate: [UnsavedGuard],
    data: {
      title: 'RotorDYN'
    },
    children: [
      {
        path: 'settings/:projectId',
        component: SettingsComponent,
        data: {
          title: 'Settings'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RotordynRoutingModule {}
