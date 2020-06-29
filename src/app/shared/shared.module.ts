import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';

import { environment } from '../../environments/environment';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { SmartResizeDirective } from './smart-resize.directive';

import { DynButtonComponent } from '../@core/components/button/dyn-button.component';
import { DynSwitcherComponent } from '../@core/components/switcher/switcher.component';
import { ProjectErrorsComponent } from '../rotordyn/project-settings/project-errors/project-errors.component';

// import { DynModalComponent } from '../components/dyn-modal.component';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const CUSTOM_DATETIME_FORMATS = environment.customDateTimeFormat;

        //CommonModule,
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        PaginationModule.forRoot(),
    ],
    declarations: [
        SpinnerComponent,
        SmartResizeDirective,
        DynButtonComponent,
        DynSwitcherComponent,
        ProjectErrorsComponent,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        SpinnerComponent,
        PaginationModule,
        DynButtonComponent,
        DynSwitcherComponent,
        ProjectErrorsComponent,
    ]
})
    /*providers: [
        { provide: OWL_DATE_TIME_FORMATS, useValue: CUSTOM_DATETIME_FORMATS },
    ]*/
export class SharedModule {
}