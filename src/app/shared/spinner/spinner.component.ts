import { Component } from '@angular/core';

@Component({
  selector: 'spinner',
  template: `
  	<div class="spinner">
      <div class="loader-bricks"></div>
    </div>
  `,
  styleUrls: [ 'spinner.component.scss' ]
})
export class SpinnerComponent {
}
