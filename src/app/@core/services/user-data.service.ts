import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from './global.service';
import {User} from '../models/user';
import {StaffService} from '../services/staff.service';
import {ResponseBody} from '../models/response-body';
import {UserList} from '../models/user-list';
import {SharedService} from './shared.service';

@Injectable()
export class UserDataService {

    constructor(
        private globalService: GlobalService,
        private staffService: StaffService,
        private http: HttpClient
    ) {
    }

    public static getStatusTypes(): Array<any> {
        return [
            {
                label: 'Active',
                value: 10
            },
            {
                label: 'Disabled',
                value: 0
            }
        ];
    }

    // GET /v1/user/me
    getMe(): Observable<User> {
        const headers = GlobalService.getHeaders();

        return this.http
            .get<ResponseBody>(
                this.globalService.apiHost + '/user/me', 
                {
                    headers: headers
                }
            )
            .map(response => {
                return <User>response.data;
            })
            .catch(GlobalService.handleError);
    }

    // GET /v1/payment/balance/userId
    getBalance(userId) {
        const headers = GlobalService.getHeaders();
        return this.http
            .get<ResponseBody>(
                this.globalService.apiHost + '/payment/balance/'+userId, 
                {
                    headers: headers
                }
            )
            .map(response => {
                return response.data;
            })
            .catch(GlobalService.handleError);
    }

    updateUser(userData): Observable<any> {
        const headers = GlobalService.getHeaders();

        return this.http
            .post<ResponseBody>(
                this.globalService.apiHost + '/user/me',
                JSON.stringify({
                    UserEditForm: userData
                }),
                {headers: headers}
            )
            .map(response => {
                if (response.success) {
                } else {
                }
                return response;
            })
            .catch(GlobalService.handleError);
    }

    // POST /v1/user
    addUser(user: User): Observable<any> {
        const headers = GlobalService.getHeaders();

        return this.http
            .post<ResponseBody>(
                this.globalService.apiHost + '/user',
                JSON.stringify(user),
                {
                    headers: headers
                }
            )
            .map((response) => {
                return response;
            })
            .catch(GlobalService.handleError);
    }

    // DELETE /v1/user/1
    deleteUserById(id: number): Observable<any> {
        const headers = GlobalService.getHeaders();

        return this.http
            .delete<ResponseBody>(
                this.globalService.apiHost + '/user/' + id,
                {
                    headers: headers
                }
            )
            .map((response) => {
                return response;
            })
            .catch(GlobalService.handleError);
    }

    // PUT /v1/user/1
    updateUserById(user: User): Observable<any> {
        const headers = GlobalService.getHeaders();

        return this.http
            .put<ResponseBody>(
                this.globalService.apiHost + '/user/' + user.id,
                JSON.stringify(user),
                {
                    headers: headers
                }
            )
            .map((response) => {
                return response;
            })
            .catch(GlobalService.handleError);
    }

    // GET /v1/user
    getAllUsers(extendedQueries?: any): Observable<UserList> {
        const headers = GlobalService.getHeaders();

        let queries = {};
        if (extendedQueries) {
            queries = Object.assign(queries, extendedQueries);
        }

        return this.http
            .get<ResponseBody>(
                this.globalService.apiHost + '/user?'
                + SharedService.serializeQueryString(queries),
                {
                    headers: headers
                }
            )
            .map((response) => {
                return new UserList(response.data);
            })
            .catch(GlobalService.handleError);
    }

    // GET /v1/user/1
    getUserById(id: number): Observable<User> {
        const headers = GlobalService.getHeaders();

        return this.http
            .get<ResponseBody>(
                this.globalService.apiHost + '/user/' + id,
                {
                    headers: headers
                }
            )
            .map((response) => {
                return <User>response.data;
            })
            .catch(GlobalService.handleError);
    }

}