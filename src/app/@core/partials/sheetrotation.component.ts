import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject} from 'rxjs'
import { ModalComponent } from '../../components/modal.component';
import { ProjectService } from '../../@core/services/project.service';

@Component({
    selector: 'sheet-rotation',
    templateUrl: 'sheetrotation.component.html',
})
export class SheetRotationComponent implements ModalComponent {
    @Input() public data: FormGroup;

    @Input('single')
    public _showExtra: boolean;
	closingSubject$: Subject<void>;

	_units: any = {};

    constructor() {
        this._units = ProjectService.getUnits();
    }

	close() {
		if (this.closingSubject$)
			this.closingSubject$.next();
	}
}