import { NgModule, Component } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './@core/auth.guard';

import { BackendLayoutComponent } from './layout/backend-layout.component';
import { FullLayoutComponent } from './layout/full-layout.component';
import { RotordynLayoutComponent } from './layout/rotordyn-layout.component';
import { SimpleLayoutComponent }  from './layout/simple-layout.component';
import { P404Component } from './page/404.component';

// import { TourComponent } from './tour/tour.component';

import { AuthComponent } from './@auth/auth.component';
import { LoginComponent } from './@auth/login/login.component';
import { RegisterComponent } from './@auth/register/register.component';
import { LogoutComponent } from './@auth/logout/logout.component';
import { RequestPasswordComponent } from './@auth/request-password/request-password.component';
import { ResetPasswordComponent } from './@auth/reset-password/reset-password.component';
import { ConfirmComponent } from './@auth/confirm/confirm.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: BackendLayoutComponent,
    data: {
        title: 'Dashboard'
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      }
    ]
  },
  {
    path: '',
    component: BackendLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'account',
        loadChildren: './account/account.module#AccountModule'
      }
    ]
  },
  {
    path: '',
    component: BackendLayoutComponent,
    children: [
      {
        path: 'plan',
        loadChildren: './plan/plan.module#PlanModule'
      }
    ]
  },
  {
    path: '',
    component: BackendLayoutComponent,
    data: {
        title: 'Home'
    },
    canActivate: [AuthGuard],
    children: [
      /*{
        path: 'staff',
        loadChildren: './staff/staff.module#StaffModule'
      },*/
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule'
      },
      {
        path: 'setting',
        loadChildren: './setting/setting.module#SettingModule'
      }
    ]
  },
  {
    path: 'rotordyn',
    canActivate: [AuthGuard],
    data: {
        title: 'RotorDYN'
    },
    children: [
      {
        path: '',
        loadChildren: './rotordyn/rotordyn.module#RotordynModule',
      }
    ]
  },
  {
    path: 'auth',
    data: {
        title: 'Auth'
    },
    children: [
      {
        path: 'auth',
        // component: LoginComponent,
        loadChildren: './@auth/auth.module#AuthModule',
      }
    ],
  },
  /*{
    path: '',
    component: SimpleLayoutComponent,
    children: [
      {
        path: 'tour',
        loadChildren: './tour/tour.module#TourModule'
        // component: TourComponent
      }
    ]
  },*/
  // otherwise redirect to 404
  { path: '**', component: P404Component }
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
