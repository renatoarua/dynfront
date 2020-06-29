import { Component, ViewChild, OnInit } from '@angular/core';
// import { NbMenuComponent } from '@nebular/theme';

@Component({
  selector: 'app-dashboard',
  templateUrl: './simple-layout.component.html',
})
export class SimpleLayoutComponent implements OnInit {
  @ViewChild('cmp') menuComponent: any;
  items = [];

  constructor() { }

  ngOnInit(): void { }

  changeItems(it) {
  	this.items = it;
  }
}
