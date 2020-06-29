import { Type } from '@angular/core';

export class ModalItem {
	public component:Type<any>;
	public data:any;
	constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}