import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ProjectService } from '../../@core/services/project.service';

@Component({
  selector: 'journal-optimization',
  templateUrl: 'journal-opt.component.html',
})
export class JournalOptimizationComponent implements OnInit {
  @Input() public data: FormGroup;
  // closingSubject$: Subject<any>;

  _units: any = {};

  constructor(private _fb: FormBuilder) {
    this._units = ProjectService.getUnits();
  }

  ngOnInit() {
    console.log(this.data.controls);
  }

  /*close() {
    if (this.closingSubject$)
      this.closingSubject$.next(this.data);
  }*/
}