import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl, FormArray } from '@angular/forms';

@Component({
  selector: 'show-errors',
  template: `
    <div *ngIf="shouldShowErrors()">
      <div class="alert alert-danger" *ngFor="let error of listOfErrors()">{{error}}</div>
    </div>
  `,
})
export class ShowErrorsComponent {

  private static readonly errorMessages = {
    'required': () => 'This field is required',
    'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
    'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
    'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
    'min': (params) => params.message,
    'max': (params) => params.message,
    'positive': (params) => params.message,
    'diameterConstraint': (params) => params.message,
    'lengthConstraint': (params) => params.message,
    'spinConstraint': (params) => params.message,
    'frequencyConstraint': (params) => params.message,
    'minLengthArray': (params) => params.message,
    'notInteger': (params) => params.message,
    'journalMode': (params) => params.message,
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
    .map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    return ShowErrorsComponent.errorMessages[type](params);
  }

}