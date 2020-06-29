import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeModule } from '../@theme/theme.module';

import { DynModalComponent } from './dyn-modal.component';
import { SideModalComponent } from './dyn-side-modal.component';
import { ModalDirective } from './modal.directive';
// import { SidebarDirective } from './sidebar.directive';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
    ],
    declarations: [
    	DynModalComponent,
        SideModalComponent,
    	ModalDirective,
    ],
    exports: [
        DynModalComponent,
        SideModalComponent,
    	ModalDirective,
    ],
    providers: []
})
export class ModalModule {
}