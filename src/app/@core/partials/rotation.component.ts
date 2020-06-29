import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectService } from '../../@core/services/project.service';

@Component({
    selector: 'shaft-rotation',
    templateUrl: 'rotation.component.html',
})
export class RotationComponent {
    @Input() public data: FormGroup;
	// closingSubject$: Subject<any>;

	_units: any = {};

	constructor() {
		this._units = ProjectService.getUnits();
	}

	/*close() {
		if (this.closingSubject$)
			this.closingSubject$.next(this.data);
	}*/
}