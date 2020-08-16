import { Component, Input, OnDestroy, EventEmitter, Output } from '@angular/core';

import { UIElement } from '../../../@core/models/shaft';

@Component({
  selector: 'dyn-node',
  styleUrls: ['./dyn-node.component.scss'],
  templateUrl: './dyn-node.component.html',
})
export class DynNodeComponent implements OnDestroy {
  position: number;
  length: number;
  diameter: number;
  public node: UIElement;
  isSection: boolean = false;
  isRibs: boolean = false;
  isBearings: boolean = false;

  splits = 2;
  joinprev: boolean = false;
  joinnext: boolean = false;

  @Input()
  set model(value: UIElement) {
    this.node = value;
    this.isSection = false;

  	if(!value)
  		return;

    this.isSection = (this.node.group == 'sections') ? true : false;
    this.isRibs = (this.node.group == 'ribs') ? true : false;
    this.isBearings = (this.node.group == 'journalbearings' || this.node.group == 'rollerbearings') ? true : false;

    console.log(this.node.group);
    console.log(this.node);
    this.joinprev = (this.node.groupId < 1) ? true : false;
    this.joinnext = false; // true if last node

  	this.length = +this.node.border.w;
  	this.diameter = +this.node.border.h;
  	this.position = +this.node.border.x;
  	if(this.node['length'] != undefined) {
  		this.position += this.length/2;
  	}
  }

  @Input('editing') editing: boolean = true;

  @Output() delete: EventEmitter<UIElement> = new EventEmitter<UIElement>();
  @Output() edit: EventEmitter<UIElement> = new EventEmitter<UIElement>();
  @Output() duplicate: EventEmitter<UIElement> = new EventEmitter<UIElement>();
  @Output() split: EventEmitter<any> = new EventEmitter<any>();
  @Output() join: EventEmitter<any> = new EventEmitter<any>();

  constructor() {

  }

  ngOnDestroy() {

  }

  splitSection() {
    this.split.emit({node:this.node, size:this.splits});
  }

  joinSection(pos) {
    this.join.emit({node:this.node, pos:pos});
  }

  duplicateNode() {
    this.duplicate.emit(this.node);
  }

  deleteNode() {
  	this.delete.emit(this.node);
  }

  editNode() {
  	this.edit.emit(this.node);
  }
}
