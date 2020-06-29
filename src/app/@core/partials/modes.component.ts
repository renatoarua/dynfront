import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Rx'
import { ModalComponent } from '../../components/modal.component';

@Component({
    selector: 'result-modes',
    templateUrl: 'modes.component.html',
})
export class ModesComponent implements ModalComponent {
    @Input() public data: FormGroup;
    closingSubject$: Subject<any>;

    constructor() {}

    close() {
		if (this.closingSubject$)
			this.closingSubject$.next(this.data);
	}
}