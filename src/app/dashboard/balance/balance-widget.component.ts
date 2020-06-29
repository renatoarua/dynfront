import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { User } from '../../@core/models/user';
// import { ElectricityService } from '../../@core/data/electricity.service';
import { UserDataService } from '../../@core/services/user-data.service';

import * as _ from 'underscore';

@Component({
  selector: 'dyn-balance',
  styleUrls: ['./balance-widget.component.scss'],
  templateUrl: './balance-widget.component.html',
})
export class BalanceComponent implements OnInit, OnDestroy {
  @Input() user: User;
  data;
  cost = 0;
  balance = 0;

  type = 'week';
  types = ['week', 'month', 'year'];

  themeSubscription: any;

  constructor(private _userService: UserDataService,
              private _router: Router) {
    // this.data = this.eService.getData();
  }

  ngOnInit() {
    this.cost = this.user.orders.reduce((acc, obj) => {
      return acc + obj.total;
    }, 0);

    this.balance = this.user.credit - this.user.debit;

    this._userService.getBalance(this.user.id)
      .subscribe((data) => {
        // this.data = data;
        data = data.map(item => {
          return Object.assign(item, {
            down: item.sellerId === this.user.id
          })
        });

        const groups = data.reduce((groups, payment) => {
          let date = new Date(payment.date*1000);
          const key = (date.getMonth()+1)+'/'+date.getFullYear();
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(payment);
          return groups;
        }, {});

        // pick at most, 3 months
        this.data = this.last(Object.keys(groups).map((date) => {
          return {
            title: date,
            orders: groups[date]
          };
        }), 3);
      });
  }

  ngOnDestroy() {
    
  }

  gotoPlans() {
    this._router.navigate(['/plan']);
  }

  last(array, n) {
    if (array == null) 
      return void 0;

    return array.slice(Math.max(array.length - n, 0));
  };
}
