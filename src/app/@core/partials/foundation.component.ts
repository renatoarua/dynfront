import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalComponent } from '../../components/modal.component';
import { Subject } from 'rxjs/Rx'
import { ProjectService } from '../../@core/services/project.service';

@Component({
    selector: 'shaft-foundation',
    templateUrl: 'foundation.component.html',
})
export class FoundationComponent implements ModalComponent {
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