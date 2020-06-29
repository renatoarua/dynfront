import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../@core/models/user';
// import { UserDataService } from '../../@core/services/user-data.service';

@Component({
    selector: 'orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    @Input() user: User;

    ngOnInit() {
    	// console.log(this.user);
    }
}