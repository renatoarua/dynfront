import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Rx'
import { ModalComponent } from '../../components/modal.component';

@Component({
    selector: 'result-campbell',
    templateUrl: 'campbell.component.html',
})
export class CampbellComponent implements ModalComponent, OnInit {
    @Input() public data: FormGroup;
    closingSubject$: Subject<any>;

    constructor() {
    	
    }

    ngOnInit() {
        // console.log(this.data);
    }

    close() {
		if (this.closingSubject$)
			this.closingSubject$.next(this.data);
	}
}