import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import swal from 'sweetalert2';

import {UserDataService} from '../@core/services/user-data.service';
import {User} from '../@core/models/user';
import {StaffService} from '../@core/services/staff.service';
import {UserList} from '../@core/models/user-list';

@Component({
    templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
    userList: UserList;
    errorMessage: string;

    loading: boolean;
    searchParams: any;
    totalCount: number;
    currentPage: number;
    pageSize: number;

    constructor(private userDataService: UserDataService,
                private staffService: StaffService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        this.currentPage = typeof queryParams['page'] !== 'undefined' ? +queryParams['page'] : 1;

        // Load search params
        this.searchParams = {};

        // Override page
        this.searchParams.page = this.currentPage;

        if (typeof queryParams['q'] !== 'undefined') {
            this.searchParams.q = queryParams['q'] + '';
        }
    }

    onSearchFormSubmit() {
        this.searchParams.page = 1;
        this.currentPage = 1;
        this.getUsers();
    }

    /**
     * Clear search params
     */
    clearSearchParams() {
        // Load search params
        this.searchParams = {};

        this.getUsers();
    }

    /**
     * Handle page changed from pagination
     *
     * @param event
     */
    pageChanged(event: any): void {
        if (event.page !== this.currentPage) {
            this.currentPage = event.page;
            this.searchParams.page = this.currentPage;

            this.getUsers();
        }
    }

    ngOnInit() {
        this.getUsers();
    }

    public getUsers() {
        this.userList = null;
        this.loading = true;

        this.router.navigate([], {queryParams: this.searchParams});

        this.userDataService.getAllUsers(this.searchParams)
            .subscribe(
                userList => {
                    this.userList = userList;
                    this.totalCount = this.userList.pagination.totalCount;
                    this.pageSize = this.userList.pagination.defaultPageSize;
                    this.loading = false;
                },
                error => {
                    // unauthorized access
                    if (error.data.status === 401 || error.data.status === 403) {
                        this.staffService.unauthorizedAccess(error);
                    } else {
                        this.errorMessage = error.data.message;
                    }
                    this.loading = false;
                }
            );
    }

    public viewUser(user: User): void {
        this.router.navigate(['/user', user.id]);
    }

    public confirmDeleteUser(user: User): void {
        // Due to sweet alert scope issue, define as function variable and pass to swal

        const parent = this;
        // let getUsers = this.getUsers;
        this.errorMessage = '';

        swal({
            title: 'Are you sure?',
            text: 'Once delete, you won\'t be able to revert this!',
            type: 'question',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            preConfirm: function () {
                parent.loading = true;
                return new Promise(function (resolve, reject) {
                    parent.userDataService.deleteUserById(user.id)
                        .subscribe(
                            result => {
                                parent.getUsers();
                                parent.loading = false;
                                resolve();
                            },
                            error => {
                                // unauthorized access
                                if (error.data.status === 401 || error.data.status === 403) {
                                    parent.staffService.unauthorizedAccess(error);
                                } else {
                                    parent.errorMessage = error.data.message;
                                }
                                parent.loading = false;
                                resolve();
                            }
                        );
                });
            }
        }).then(function (result) {
            // handle confirm, result is needed for modals with input

        }, function (dismiss) {
            // dismiss can be "cancel" | "close" | "outside"
        });
    }
}