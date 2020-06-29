import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Rx'
import { ProjectService } from '../../@core/services/project.service';
import { ModalComponent } from '../../components/modal.component';

@Component({
    selector: 'shaft-disc',
    templateUrl: 'disc.component.html',
})
export class DiscComponent implements ModalComponent {
    @Input() public data: FormGroup;
    closingSubject$: Subject<any>;
    _materials: any = {};
    _units: any = {};

    constructor() {
    	this._materials = ProjectService.getMaterials();
        this._units = ProjectService.getUnits();
    }

    close() {
		if (this.closingSubject$)
			this.closingSubject$.next(this.data);
	}
}