import { Component, OnDestroy, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { UIElement, Project } from '../../@core/models/shaft';

@Component({
  selector: 'dyn-svg',
  styleUrls: ['./dyn-svg.component.scss'],
  templateUrl: './dyn-svg.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynSvgComponent implements OnDestroy {
  _project: Project;
  _originalName: string;
  
  @Input()
  set model(value: Project) {
    if(value) this._originalName = value.name;
    this._project = Object.assign({}, value);
    this.onChange();
  }

  @Input('editing') editing: boolean = true;

  @Output() delete: EventEmitter<UIElement> = new EventEmitter<UIElement>();
  @Output() edit: EventEmitter<UIElement> = new EventEmitter<UIElement>();
  @Output() duplicate: EventEmitter<UIElement> = new EventEmitter<UIElement>();

  selected: UIElement;

  constructor() {
  }

  onChange() {
    if (this.selected === undefined || this.selected === null)
      return false;

    const machine = this._project.machine;
    let node = machine[this.selected.group][this.selected.groupId];

    this.select(node);
  }

  select(node: UIElement) {
    this.selected = node;
  }

  duplicateNode(node: UIElement) {
    this.duplicate.emit(node);
  }

  deleteNode(node: UIElement) {
    this.delete.emit(node);
  }

  editNode(node: UIElement) {
    this.edit.emit(node);
  }

  private isSelected(roomNumber): boolean {
    if (this.selected === undefined)
      return false;

    return this.selected.nodeId === roomNumber;
  }

  ngOnDestroy() {
    
  }
}
