import { Component, AfterViewChecked } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState, AppStatus } from '../../@core/store/models';
import { getCart } from '../../@core/store/reducers';

import { Cart } from '../../@core/models/payment';
import { PaymentService } from '../../@core/services/payment.service';
import { UserService } from '../../@core/services/user.service';

import { jsonPlans } from '../../@core/data/jsonPlans';

// import { PayPalCheckout } from 'braintree-web/paypal-checkout';
// import { Client } from 'braintree-web/client';

import { Observable } from 'rxjs/Rx';
// declare let paypal: any;

declare let dropin: any;

@Component({
  selector: 'payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss']
})
export class PaymentOptionsComponent implements AfterViewChecked {
  cart: Cart;
  subscription;

  public didPaypalScriptLoad: boolean = false;
  public loading: boolean = true;

  public paymentAmount: number = 0;

  constructor(private _store: Store<AppState>,
              private userService: UserService,
              private _paymentService: PaymentService) {

    this.subscription = this._store
      .select(getCart)
      .subscribe(res => {
        if(res) {
          this.cart = res;
          this.paymentAmount = 1;//res.total;
        }
      });
  }

  public paypalConfig: any = {
    env: 'sandbox',
    style: {
      label: 'checkout',
      size:  'small',    // small | medium | large | responsive
      shape: 'rect',     // pill | rect
      color: 'silver',      // gold | blue | silver | black
      tagline: 'false'
    },
    client: {
      sandbox: 'access_token$sandbox$k3ytwsqhtfdvcnqw$51fd4e27310d12758784293b1541eeb4',
      production: 'xxxxxxxxxx'
    },
    commit: true,
    payment: (data, actions) => {
      /*return actions.braintree.create({
        flow: 'checkout', // Required
        amount: 1.00, // Required
        currency: 'USD', // Required
        enableShippingAddress: false,
      });*/
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.paymentAmount, currency: 'USD' } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        // show success page
      });
    }
  };

  public ngAfterViewChecked() {
    // this.paypal.Button.render(this.paypalConfig, '#paypal-button');
    /*if(!this.didPaypalScriptLoad) {
      this.loadPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-button');
        this.loading = false;
      });
    }*/
    /*let client = this._client.create({
      authorization: 'CLIENT_AUTHORIZATION'
    });*/
    /*braintree.dropin.create({
        authorization: 'CLIENT_AUTHORIZATION',
        container: '#dropin-container'
      }, function (createErr, instance) {
        console.log(createErr);
      });*/
  }

  public loadPaypalScript(): Promise<any> {
    this.didPaypalScriptLoad = true;
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      // scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=AQaa1xn1v7WQOnUSPIaOKgZ1poAeGtO7kVU3xrCqgBxIvVXUY9MfMZuaNs7QWoG7OsPHSqQrOX46eLQm';
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  getClientTokenFunction(): Observable<string> {
    return Observable.of('sandbox_pgj433g3_ksvtgt76t8t3md29');
  }

  createPurchase(nonce: string, chargeAmount: number) {
    return Observable.of({
      Amount: chargeAmount,
      PaymentMethodNonce: nonce
    });
  }

  onPaymentStatus($ev) {
    console.log($ev);
  }
}