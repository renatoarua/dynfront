import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx'

import { ModalDirective } from './modal.directive';
import { ModalItem }      from './modal-item';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'dyn-modal',
  styleUrls: ['./dyn-modal.component.scss'],
  templateUrl: './dyn-modal.component.html',
})
export class DynModalComponent implements OnInit, OnDestroy {
  // @Input('list') modals: ModalItem[];
  @ViewChild(ModalDirective) modalHost: ModalDirective;

  @Output() onOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onConfirm: EventEmitter<any> = new EventEmitter<any>();

  private _closeDialog$: Subject<any>;

  currentModalIndex = -1;
  isActive = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.isActive = false;
  }

  ngOnDestroy() {
    // clearInterval(this.interval);
    if(this._closeDialog$) {
      this._closeDialog$.unsubscribe();
    }
  }

  loadComponent() {
    // this.currentModalIndex = (this.currentModalIndex + 1) % this.modals.length;
    // let item = this.modals[this.currentModalIndex];

    // this.openModal(item);
  }

  openModal(item: ModalItem) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

    let viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<ModalComponent>componentRef.instance).data = item.data;

    this._closeDialog$ = new Subject<any>();
    this._closeDialog$.subscribe((payload) => {
      this.closeModal(payload, false);
    });
    (<ModalComponent>componentRef.instance).closingSubject$ = this._closeDialog$;

    this.isActive = true;
    this.onOpen.emit(true);
  }

  closeModal(payload:any=null, cancel=true) {
    this.isActive = false;
    this._closeDialog$.unsubscribe();
    this.modalHost.viewContainerRef.clear();
    if (cancel)
      this.onCancel.emit(true);
    else
      this.onConfirm.emit(payload);
  }

  // checks new stuff every 3 seconds
  /*interval: any;
  getAds() {
    this.interval = setInterval(() => {
      this.load();
    }, 3000);
  }*/
}
