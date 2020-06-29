import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validator } from "@angular/forms";

@Component({
  selector: 'num-input',
  template: `
    <div [ngClass]="{'has-danger': control.invalid && control.dirty}">
        <!--{{name}}-->
        <label for="{{name}}" [innerHTML]="title+required"></label>
        <input type="number" [value]="control.value" class="form-control" id="position" placeholder="{{title}}" [autofocus]="auto" (change)="onChange($event)" (keyup)="onChange($event)">
        <show-errors [control]="control"></show-errors>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumInputComponent),
      multi: true,
    }
  ]
})
export class NumInputComponent implements ControlValueAccessor {
  constructor() {}
  @Input() name: string;
  @Input() title: string;
  @Input() auto: boolean = false;
  @Input() control: FormControl;
  @Input('value') data: number = 0;

  required = `<span class="required">*</span>`;

  // this is the initial value set to the component
  writeValue(obj: any) {
    if(obj)
      this.data = obj;
  }

  // registers 'fn' that will be fired when changes are made
  // this is how we emit the changes back to the form
  registerOnChange(fn: any) {
    this.propagateChange = fn;
    // this._onChange = fn;
  }

  // not used, used for touch input
  public registerOnTouched() { }

  // change events from the textarea
  onChange(event) {
    // get value from input
    let newValue = event.target.value;
    // treat newValue

    // update the form
    this.propagateChange(newValue);
  }

  // the method set in registerOnChange to emit changes back to the form
  propagateChange = (_: any) => { };
}


