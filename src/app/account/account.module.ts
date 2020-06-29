// import * as ngCore from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule } from '../@theme/theme.module';

import { AccountComponent } from './account.component';
import { AccountEditComponent } from './account-edit.component';
import { AccountRoutingModule } from './account-routing.module';

import { OrdersComponent } from './orders/orders.component';
import { TokenUsageComponent } from './token-usage/token-usage.component';
// import { BalanceComponent } from './balance/balance.component';
import { UserProfileComponent } from './user-profile.component';

// import { MomentModule } from 'ngx-moment';
// let PayPalButtonModule = paypal.Button.driver('angular2', ngCore);

@NgModule({
  imports: [
    AccountRoutingModule,
    ThemeModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    AccountComponent,
    AccountEditComponent,
    UserProfileComponent,
    OrdersComponent,
    TokenUsageComponent,
  ]
})
export class AccountModule {
}


