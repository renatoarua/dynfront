import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared/shared.module';

import { AuthComponent } from './auth.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmComponent } from './confirm/confirm.component';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ThemeModule,
        SharedModule,
        ReactiveFormsModule,
        AuthRoutingModule,
    ],
    declarations: [
    	LoginComponent,
        RegisterComponent,
        LogoutComponent,
		RequestPasswordComponent,
		ResetPasswordComponent,
        ConfirmComponent,
    ]
})
export class AuthModule {
}
