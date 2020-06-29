import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import swal from 'sweetalert2';

import {UserDataService} from '../@core/services/user-data.service';
import {User} from '../@core/models/user';
import {StaffService} from '../@core/services/staff.service';
import {UserList} from '../@core/models/user-list';

@Component({
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
    
    errorMessage: string;

    loading: boolean;

    constructor(private userDataService: UserDataService,
                private staffService: StaffService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        
    }

    ngOnInit() {}
}