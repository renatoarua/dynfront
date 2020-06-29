import { Component, OnInit } from '@angular/core';
import { UserService } from '../../@core/services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'dyn-confirm',
    templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit {
    submitted: boolean = false;
    errorMessage: string = '';
    isConfirmed: boolean = false;

    constructor(
        private userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        // this.userService.logout();
        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (
                typeof params['id'] !== 'undefined' &&
                typeof params['auth_key'] !== 'undefined'
            ) {
                const id = params['id'];
                const auth_key = params['auth_key'];
                this.onConfirm(id, auth_key);
            } else {
                this.errorMessage =
                    'The parameters are missing. Please check your access';
            }
        });
    }

    private onConfirm(id, auth_key) {
        this.errorMessage = '';
        this.submitted = true;
        this.isConfirmed = false;

        this.userService.signupConfirm(id, auth_key).subscribe(
            result => {
                if (result.success) {
                    // show confirmation
                    this.isConfirmed = true;
                } else {
                    this.errorMessage =
                        'Account confirmation is failed. Please check and try again.';
                    this.submitted = false;
                    this.isConfirmed = false;
                }
            },
            error => {
                if (typeof error.data.message !== 'undefined') {
                    try {
                        const message = JSON.parse(error.data.message);
                        let errorMessage = '';

                        for (const m of Object.keys(message)) {
                            errorMessage += message[m] + '\n';
                        }

                        this.errorMessage = errorMessage;
                    } catch (e) {
                        this.errorMessage = error.data.message;
                    }
                } else {
                    this.errorMessage = error.data;
                }

                this.submitted = false;
                this.isConfirmed = false;
            }
        );
    }
}

// http://localhost:4200/#/auth/confirm?id=10&auth_key=rcCq22lP1TXf9mxLyCkmGj8qwg4QirJ0