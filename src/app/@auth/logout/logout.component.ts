import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import { StaffService } from '../../@core/services/staff.service';

@Component({
    selector: 'dyn-logout',
    template: '<strong>Logging out...</strong>',
})
export class LogoutComponent implements OnInit {

    submitted:boolean = false;
    error:string = '';

    constructor(private _staffService:StaffService, private _router:Router) { }

    ngOnInit() {
        this._staffService.logout();
        this._router.navigate(['/']);
    }
}
