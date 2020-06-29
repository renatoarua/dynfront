import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { Store } from '@ngrx/store';
import { AppState, AppStatus } from '../@core/store/models';
import { getCart } from '../@core/store/reducers';
import { UIAddToCart } from '../@core/store/actions';

import { User } from '../@core/models/user';
import { Cart, Plan } from '../@core/models/payment';
import { PaymentService } from '../@core/services/payment.service';
import { UserService } from '../@core/services/user.service';

@Component({
    selector: 'app-plans',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
    cart: Cart;
    subscription;
    plans: Plan[];

    errorMessage: string;

    mode: string = '';
    user: User;

    showInitialsValue = true;
    imageBackgroundStyle = null;

    constructor(
        private _store: Store<AppState>,
        private userService: UserService,
        private _router: Router,
        private _paymentService: PaymentService
    ) {
        _paymentService.getPlans(100)
            .subscribe((pl) => {
                this.plans = <Plan[]>pl;
                console.log(this.plans);
            })

        this.subscription = this._store
            .select(getCart)
            .subscribe(res => {
                this.cart = res;
            });
    }

    public ngOnInit() {
        this.errorMessage = '';
        /*this._paymentService.getAllPlans().subscribe(
            plans => {
                this.plans = plans;
            },
            error => {
                this.errorMessage = error.data.message;
            }
        );*/
    }

    register() {
        this._router.navigate(['/auth/register']);
    }

    selectPlan(id) {
        // put on "cart" / store
        this._store.dispatch(new UIAddToCart(this.plans[id]));
        this._router.navigate(['/plan/checkout']);
    }
}
