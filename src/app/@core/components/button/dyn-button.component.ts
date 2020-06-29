import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dyn-button',
  styleUrls: ['./dyn-button.component.scss'],
  template: `
    <div class="dynbutton" [ngClass]="status">
      <p><ng-content select=".name"></ng-content></p>
      <div class="dyn-btn" (click)="clicked()">
        <span class="button"></span>
        <span class="icon"><ng-content select=".icon"></ng-content></span>
      </div>
    </div>
  `,
})
export class DynButtonComponent {
  @Input() type: string = "primary";
  @Input() status: string = "";
  @Output() onclick = new EventEmitter<boolean>();

  clicked() {
    this.onclick.emit(true);
  }
}
