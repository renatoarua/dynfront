import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Rx'
import { ModalComponent } from '../../components/modal.component';
import { ProjectService } from '../../@core/services/project.service';

@Component({
    selector: 'result-stiffness',
    templateUrl: 'stiffness.component.html',
})
export class StiffnessComponent implements ModalComponent {
    @Input() public data: FormGroup;
    closingSubject$: Subject<any>;

    _units: any = {};

    constructor() {
        this._units = ProjectService.getUnits();
    }

    close() {
		if (this.closingSubject$)
			this.closingSubject$.next(this.data);
	}
}