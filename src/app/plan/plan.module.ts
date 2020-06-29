// import * as ngCore from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule } from '../@theme/theme.module';

import { PlanComponent } from './plan.component';
import { PlanRoutingModule } from './plan-routing.module';

import { OrderOptionsComponent } from './order/order-options.component';
import { PaymentOptionsComponent } from './payment/payment-options.component';

import { NgxBraintreeModule } from 'ngx-braintree';
import { HttpClientModule } from '@angular/common/http';

// import { ModalModule } from '../components/modal.module';

@NgModule({
  imports: [
    PlanRoutingModule,
    ThemeModule,
    CommonModule,
    SharedModule,
    NgxBraintreeModule,
    HttpClientModule
  ],
  declarations: [
    PlanComponent,
    OrderOptionsComponent,
    PaymentOptionsComponent,
  ]
})
export class PlanModule {
}


