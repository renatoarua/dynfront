import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../@core/models/user';
import { UserDataService } from '../../@core/services/user-data.service';

@Component({
  selector: 'token-usage',
  templateUrl: './token-usage.component.html',
  styleUrls: ['./token-usage.component.scss']
})
export class TokenUsageComponent implements OnInit {
  @Input() user: User;
  payments;

  constructor(private _userService: UserDataService) {

  }

  ngOnInit() {
    // console.log(this.user);
    this._userService.getBalance(this.user.id)
      .subscribe((data) => {
        this.payments = data;
        this.payments = this.payments.map(item => {
          return Object.assign(item, {
            down: item.sellerId === this.user.id
          })
        });
      })
  }
}