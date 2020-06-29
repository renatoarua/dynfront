import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'dyn-switcher',
  styleUrls: ['./switcher.component.scss'],
  template: `
    <div class="dyntoggle" (click)="turn()" [ngClass]="on ? 'on' : 'off'">
      <div class="toggle">
        <input
          type="checkbox"
          [name]="slugify(label)"
          [checked]="on">
        <label data-tg-off="OFF" data-tg-on="ON" for="{{slugify(label)}}"></label>
      </div>
      <div class="title">{{ label }}</div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynSwitcherComponent),
      multi: true
    }
  ]
})
export class DynSwitcherComponent implements ControlValueAccessor {
  constructor() {}

  @Input() label: string;
  @Input('value') on:boolean = false;

  @Output('change') change: EventEmitter<any> = new EventEmitter<any>();

  private _onChange = (_:any) => {};
  private _onTouched = () => {};

  //get accessor
  get value(): any {
    return this.on;
  };

  //set accessor including call the onchange callback
  set value(val: any) {
    this.on = val;
    this._onChange(val);
    this._onTouched();
  }

  //From ControlValueAccessor interface
  writeValue(obj: any) {
    this.on = obj;
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this._onChange = fn;
    /*this._onChange = () => {
      this.change.emit(this.on);
    };*/
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    // this._onTouched = fn;
    this._onTouched = () => {
      this.change.emit(true);
    };
  }

  /*onBlur(event: any) {
    this._onTouched();
  }*/

  turn() {
    this.value = !this.on;
    // this.on = !this.on;
  }

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }
}
