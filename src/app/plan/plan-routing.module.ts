import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanComponent } from './plan.component';

import { OrderOptionsComponent } from './order/order-options.component';
import { PaymentOptionsComponent } from './payment/payment-options.component';

const routes: Routes = [
  {
    path: '',

    data: {
      title: 'Plan'
    },
    children: [
      {
        path: 'checkout',
        component: PaymentOptionsComponent,
        data: {
          title: 'Payment Options'
        }
      },
      {
        path: '',
        pathMatch: 'full',
        component: PlanComponent,
        data: {
          title: 'Plan'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule {
}
