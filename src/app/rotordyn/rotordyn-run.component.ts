import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectDataService } from '../@core/services/project-data.service';
import { GlobalService } from '../@core/services/global.service';
import { Observable, Subscription } from "rxjs/Rx";

export interface ITask {
    name: string;
    message: string;
    completion: string;
}

@Component({
  selector: 'rotordyn-run',
  template: `
    <div class="container">
        <div class="starter-template">
            <h1>Run Log # XX</h1>
            <br />
            <p class="lead">Started at: hh:mm:ss</p>
            <p class="lead">Cost: X DYN tokens</p>
            <br /><br />
            <table class="table">
                <tr>
                    <th class="text-center">Task</th>
                    <th class="text-right">Progress</th>
                    <th class="text-right">Status</th>
                </tr>
                <tr *ngIf="!this.tasks">
                    <td colspan="4" class="text-center">Loading... Please wait...</td>
                </tr>
                <tr *ngFor="let task of tasks; let i = index">
                    <td class="text-center">{{dataKeys[i]}}</td>
                    <td class="text-right">{{task.completion}} %</td>
                    <td class="text-right">{{task.message}}</td>
                </tr>
                <tr>
                    <td class="text-center"> - </td>
                    <td class="text-right">{{progress['completion']}}</td>
                    <td class="text-right">{{progress['message']}}</td>
                </tr>
            </table>
        </div>
    </div>
   `
})
  // templateUrl: './payment-options.component.html',
  // styleUrls: ['./payment-options.component.scss']

export class RotordynRunComponent implements OnInit {
    projectId: string;
    runId: number;
    subscription: Subscription;
    // private tasks;

    tasks: ITask[] = []; //For values
    dataKeys = []; //For keys
    progress = [];


    constructor(private _dataService:ProjectDataService,
                private _globalService: GlobalService,
                private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.projectId = this.activatedRoute.snapshot.paramMap.get("projectId");
        this.runId = +this.activatedRoute.snapshot.paramMap.get("runId");

        if(!this.projectId || !this.runId)
            return;

        let observable = Observable.create(observer => {
            const eventSource = new EventSource(this._globalService.apiHost+'/machine/status?runid='+this.projectId+'_'+this.runId);
            // eventSource.onmessage = (message) => {
            //     observer.next(message);
            // };
            // eventSource.onerror = (error) => observer.error(error);
            eventSource.addEventListener('open', function(e) {
                // Connection was opened.
            }, false);

            eventSource.addEventListener('logger', function(e) {
                observer.next(e);
            }, false);
            
            eventSource.addEventListener('error', function(e) {
                console.log(e);
                // if (e.readyState == EventSource.CLOSED) {
                //     // Connection was closed.
                // }
            }, false);

            return () => {
                eventSource.close();
            };
        });
        this.subscription = observable.subscribe({
            next: tasks => {
                this.tasks = [];
                this.dataKeys = [];
                this.progress = [];
                let rawData = JSON.parse(tasks.data);
                for(let key in rawData) {
                    if (key == 'projectId' || key == 'time') {
                        continue;
                    }
                    if (key == 'general') {
                        this.progress = rawData[key];
                        continue;
                    }
                    this.tasks.push(<ITask>rawData[key]);
                    this.dataKeys.push(key);
                }
            },
            error: err => {
                console.error('something wrong occurred: ', err);
            }
        });
    }

    makeObjects(objects : any = []) {
        return Object.values(objects);
    }

    ngOnDestroy() {

        this.subscription.unsubscribe();
    }
}