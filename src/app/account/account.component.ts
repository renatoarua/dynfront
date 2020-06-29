import {Component, OnInit} from '@angular/core';

import {User} from '../@core/models/user';
import {UserDataService} from '../@core/services/user-data.service';
import {UserService} from '../@core/services/user.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    errorMessage: string;

    mode: string = '';
    user: User;

    showInitialsValue = true;
    imageBackgroundStyle = null;

    constructor(
        private userService: UserService,
        private userDataService: UserDataService
    ) {
    }

    getInitials() {
        if (this.user.username) {
            var names = this.user.username.split(' ');
            return names.map(function (n) { return n.charAt(0); }).splice(0, 2).join('').toUpperCase();
        }
        return '';
    };

    public ngOnInit() {
        this.errorMessage = '';
        this.userDataService.getMe().subscribe(
            user => {
                this.user = user;
                this.mode = 'view';
                // this.imageBackgroundStyle = "url(" + user.picture + ")";// this.domSanitizer.bypassSecurityTrustStyle("url(" + user.picture + ")");
            },
            error => {
                // unauthorized access
                if (error.status === 401 || error.status === 403) {
                    this.userService.unauthorizedAccess(error);
                } else {
                    this.errorMessage = error.data.message;
                }
            }
        );
    }
}
