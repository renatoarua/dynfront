import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Rx'
import { ModalComponent } from '../../components/modal.component';
import { ProjectService } from '../../@core/services/project.service';

@Component({
    selector: 'shaft-roller',
    templateUrl: 'roller.component.html',
})
export class RollerComponent implements ModalComponent {
    @Input() public data: FormGroup;
    
    @Input('isVes')
    public vesbearing: boolean = false;
    _units: any = {};

    constructor() {
        this._units = ProjectService.getUnits();
    }

	closingSubject$: Subject<any>;

	close() {
		if (this.closingSubject$)
			this.closingSubject$.next(this.data);
	}
}