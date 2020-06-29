import { Component, Input, forwardRef, Output, EventEmitter, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'dyn-number-input',
  styleUrls: ['./number-input.component.scss'],
  template: `
    <div class="number-input">
  		<button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" ></button>
  		<input min="0" name="{{slugify(name)}}" [value]="_inputValue" type="number" [placeholder]="name">
  		<button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="plus"></button>
  	</div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    }
  ]
})
export class NumberInputComponent implements ControlValueAccessor, OnChanges {
  constructor() {}
  @Input() name: string;
  @Input('value')
    _inputValue:number = 0;

  @Output('onChange') change: EventEmitter<any> = new EventEmitter<any>();

  private _onChange = (_:any) => {};
  private _onTouched = () => {};

  //get accessor
  get value(): any {
    return this._inputValue;
  };

  //set accessor including call the onchange callback
  set value(val: any) {
    this._inputValue = val;
  	this._onChange(val);
  }

  ngOnChanges() {
    this._onChange(this._inputValue);
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    // this._onTouched = fn;
    this._onTouched = () => {
      this.change.emit(true);
    };
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if(value)
      this._inputValue = value;
  }

  /*validate(c: FormControl) {
    return this.validateFn(c);
  }*/

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }
}


