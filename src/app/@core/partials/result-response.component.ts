import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Rx'
import { ModalComponent } from '../../components/modal.component';
import { ProjectService } from '../../@core/services/project.service';

@Component({
    selector: 'result-response',
    templateUrl: 'result-response.component.html',
})
export class ResultResponseComponent implements ModalComponent {
    @Input() public data: FormGroup;
    @Input() public showCoord: boolean = true;

    closingSubject$: Subject<any>;
    _units: any = {};
    _coords: any[];

    constructor() {
        this._units = ProjectService.getUnits();
        this._coords = [{
            label: "X",
            value: 1
          },{
            label: "Z",
            value: 2
          },{
            label: "&theta; Theta",
            value: 3
          },{
            label: "&psi; Psi",
            value: 4
        }];
    }

    close() {
		if (this.closingSubject$)
			this.closingSubject$.next(this.data);
	}
}