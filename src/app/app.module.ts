import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, ErrorHandler } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';

// Routing Module
import { AppRoutingModule } from './app.routing';

// ngrx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UIReducer, ProjectReducer, EditorReducer } from './@core/store/reducers';
import { EDITOR_UPDATE_MACHINE, EDITOR_UPDATE_SETTINGS, UNDO, REDO } from './@core/store/actions';
import { undoRedo } from './@core/store/undoRedo';

// Layouts
import { AuthComponent } from './@auth/auth.component';
import { BackendLayoutComponent } from './layout/backend-layout.component';
import { FullLayoutComponent } from './layout/full-layout.component';
import { SimpleLayoutComponent } from './layout/simple-layout.component';
import { P404Component } from './page/404.component';

// Shared
import { SharedModule } from './shared/shared.module';
// import { ThreeModule } from '../three/three.module';

import { CoreModule } from './@core/core.module';
import { AuthModule } from './@auth/auth.module';
import { ThemeModule } from './@theme/theme.module';
import { environment } from './../environments/environment';

import { AuthGuard } from './@core/auth.guard';
import { CollectionGuard } from './@core/collection.guard';
import { SelectionGuard } from './@core/selection.guard';
import { UnsavedGuard } from './@core/unsaved.guard';

import { GlobalErrorHandlerService } from './@core/services/error-handler.service';

// Model & Services
// import { GlobalService } from './model/global.service';
// import { StaffService } from './model/staff.service';
// import { StaffDataService } from './model/staff-data.service';
// import { UserDataService } from './model/user-data.service';
// import { SettingDataService } from './model/setting-data.service';

// 3rd Party
// import { SmartResizeDirective } from './shared/smart-resize.directive';
// import { ProjectDataService } from './model/project-data.service';
// import { ProjectService } from './model/project.service';

// Components
import { ModalModule } from './components/modal.module';

export function tokenGetter() {
  return localStorage.getItem(environment.tokenName);
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    BackendLayoutComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    P404Component,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    ModalModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [environment.apiHost]
      }
    }),
    StoreModule.forRoot(
      {uiState: UIReducer, collection: ProjectReducer, editor: EditorReducer},
      {
        metaReducers: [undoRedo]
      }
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    { 
      provide: APP_BASE_HREF, useValue: '/'
    },
    AuthGuard,
    CollectionGuard,
    SelectionGuard,
    UnsavedGuard,
  ],
  bootstrap: [AppComponent]
})
    /*GlobalErrorHandlerService,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },*/
export class AppModule {

}

