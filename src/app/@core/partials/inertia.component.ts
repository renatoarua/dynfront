import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Rx'
import { ProjectService } from '../../@core/services/project.service';
import { ModalComponent } from '../../components/modal.component';

@Component({
    selector: 'shaft-inertia',
    templateUrl: 'inertia.component.html',
})
export class InertiaComponent implements ModalComponent {
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