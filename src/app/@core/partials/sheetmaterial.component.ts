import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject} from 'rxjs'
import { ModalComponent } from '../../components/modal.component';

@Component({
    selector: 'sheet-material',
    templateUrl: 'sheetmaterial.component.html',
})
export class SheetMaterialComponent implements ModalComponent {
    @Input() public data: FormGroup;
	closingSubject$: Subject<any>;

	close() {
		if (this.closingSubject$)
			this.closingSubject$.next(this.data);
	}
}