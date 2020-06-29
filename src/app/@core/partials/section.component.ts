import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from '../validators/custom-validators';
import { Subject } from 'rxjs/Rx'
import { ProjectService } from '../../@core/services/project.service';
import { ModalComponent } from '../../components/modal.component';

import { Sections, Ribs } from '../../@core/models/shaft';
import { LinkedList, LinkedNode } from '../../@core/models/linked-list';

@Component({
    selector: 'shaft-section',
    templateUrl: 'section.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent implements ModalComponent {
    _data: FormGroup;
    _totalLength;

    num = 0;
    _insertPos = [];
    isEditing: boolean = false;
    _hasRibs: boolean = false;

    @Input()
    set data(value: {data: FormGroup, length: number, editing: boolean}) {
        this._data = value.data;
        this._totalLength = value.length;
        this.isEditing = value.editing;
        this.num = this._data.controls['insertAt'].value - 1;

        if(this._data.get('ribs').value.length > 0)
            this._hasRibs = true;

        if(this.isEditing) {
            this._data.controls['position'].setValue(this._data.controls['position'].value - this._totalLength);
        } else {
            this._insertPos = [];
            for (let i = 1; i <= this.num; i++) {
                this._insertPos.push({
                    label: '#'+i,
                    value: i-1,
                    selected: false
                });
            }
            this._insertPos.push({
                label: 'Last',
                value: this.num,
                selected: true
            });
        }
    }

    closingSubject$: Subject<any>;
    _materials: any = {};
    _units: any = {};

    constructor(private _fb: FormBuilder) {
    	this._materials = ProjectService.getMaterials();
        this._units = ProjectService.getUnits();
    }

    testSelect($ev) {
        // console.log($ev);
    }

    initRibs(rib?: Ribs) {
        let group = this._fb.group({
            position: rib ? [+rib.position] : [''],
            number: rib ? [+rib.number] : [''],
            webThickness: rib ? [+rib.webThickness] : [''],
            webDepth: rib ? [+rib.webDepth] : [''],
            flangeWidth: rib ? [+rib.flangeWidth] : [''],
            flangeThick: rib ? [+rib.flangeThick] : [''],
        });

        group.controls['number'].setValidators([Validators.required, CustomValidators.ValidateInteger(), CustomValidators.ValidatePositive(false)]);
        group.controls['webThickness'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
        group.controls['webDepth'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
        group.controls['flangeThick'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
        group.controls['flangeWidth'].setValidators([Validators.required, CustomValidators.ValidatePositive(false)]);
        return group;
    }

    addRibs() {
        const control = <FormArray>this._data.controls['ribs'];
        control.push(this.initRibs());
        this._hasRibs = true;
    }

    removeRibs(i: number) {
        const control = <FormArray>this._data.controls['ribs'];
        control.removeAt(i);
        this._hasRibs = false;
    }

	close() {
		if (this.closingSubject$) {
            let n = this._data.controls['insertAt'].value - 1
            if(this.num == n)
                this._data.controls['position'].setValue(this._data.controls['position'].value + this._totalLength);
			this.closingSubject$.next(this._data);
        }
	}
}