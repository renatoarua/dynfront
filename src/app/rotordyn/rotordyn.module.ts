import { NgModule } from '@angular/core';

import { PlotlyModule } from 'angular-plotly.js';

import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared/shared.module';
// import { ThreeModule } from '../../three/three.module';

import { EditorLayoutComponent } from '../layout/editor-layout.component';
import { RotordynLayoutComponent } from '../layout/rotordyn-layout.component';
import { CleanLayoutComponent } from '../layout/clean-layout.component';

import { RotordynRoutingModule } from './rotordyn-routing.module';

import { ModalModule } from '../components/modal.module';

import { DynToolbarComponent } from './dyn-toolbar/dyn-toolbar.component';

import { RotordynComponent } from './rotordyn.component';
import { RotordynRunComponent } from './rotordyn-run.component';
import { RotordynListComponent } from './rotordyn-list.component';
import { RotordynEditComponent } from './rotordyn-edit.component';
import { RotordynEdit3dComponent } from './rotordyn-edit3d.component';
import { RotordynDetailComponent } from './rotordyn-detail.component';
import { RotordynFormComponent } from './rotordyn-form.component';
import { RotordynCreateComponent } from './rotordyn-create.component';

/* Dashboard elements/components */
// import { DynSwitcherComponent } from '../@core/components/switcher/switcher.component';
import { NumberInputComponent } from '../@core/components/number-input/number-input.component';
import { NumInputComponent } from '../@core/components/number-input/input.component';
// import { DynButtonComponent } from '../@core/components/button/dyn-button.component';
import { ShowErrorsComponent } from '../@core/components/form-errors/show-errors.component';

import { DynSvgComponent } from './dyn-svg/dyn-svg.component';
import { TwoViewerComponent } from './dyn-svg/twoviewer/twoviewer.component';
import { DynNodeComponent } from './dyn-svg/dyn-node/dyn-node.component';
import { SettingsComponent } from './project-settings/settings.component';
// import { ProjectErrorsComponent } from './project-settings/project-errors/project-errors.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';

/* Entry Modal Form Components */
import { SectionComponent } from '../@core/partials/section.component';
import { DiscComponent } from '../@core/partials/disc.component';
import { InertiaComponent } from '../@core/partials/inertia.component';
import { RollerComponent } from '../@core/partials/roller.component';
import { RibComponent } from '../@core/partials/rib.component';
import { FoundationComponent } from '../@core/partials/foundation.component';
import { JournalComponent } from '../@core/partials/journal.component';
import { VesComponent } from '../@core/partials/ves.component';
import { SheetComponent } from '../@core/partials/sheet.component';
import { SheetMaterialComponent } from '../@core/partials/sheetmaterial.component';
import { SheetRotationComponent } from '../@core/partials/sheetrotation.component';
import { SheetTranslationComponent } from '../@core/partials/sheettranslation.component';

import { RotationComponent } from '../@core/partials/rotation.component';
import { JournalOptimizationComponent } from '../@core/partials/journal-opt.component';
import { JournalPropertiesComponent } from '../@core/partials/journal-prop.component';

/* Entry Modal Result Form Components */
import { CampbellComponent } from '../@core/partials/campbell.component';
import { StiffnessComponent } from '../@core/partials/stiffness.component';
import { ModesComponent } from '../@core/partials/modes.component';
import { UnbalanceComponent } from '../@core/partials/unbalance.component';
import { ConstantComponent } from '../@core/partials/constant.component';
import { TorsionalComponent } from '../@core/partials/torsional.component';
import { TimeComponent } from '../@core/partials/time.component';
import { ResultForceComponent } from '../@core/partials/result-force.component';
import { ResultPhaseComponent } from '../@core/partials/result-phase.component';
import { ResultResponseComponent } from '../@core/partials/result-response.component';
import { ResultTorkComponent } from '../@core/partials/result-tork.component';

/* Result Charts */
import { DynLineChartComponent } from '../@core/results/dyn-line-chart';
import { DynCampbellChartComponent } from '../@core/results/dyn-campbell-chart';
import { DynInstabilityChartComponent } from '../@core/results/dyn-instability-chart';
import { DynCampbell3DChartComponent } from '../@core/results/dyn-campbell3d-chart';
import { DynEstabilitiesChartComponent } from '../@core/results/dyn-estabilities-chart';
import { DynConstantChartComponent } from '../@core/results/dyn-constant-chart';
import { DynUnbalanceChartComponent } from '../@core/results/dyn-unbalance-chart';
import { DynUnbChartComponent } from '../@core/results/dyn-unb-chart';
import { DynTorsionalChartComponent } from '../@core/results/dyn-torsional-chart';
import { DynModesChartComponent } from '../@core/results/dyn-modes-chart';
import { DynTimeChartComponent } from '../@core/results/dyn-time-chart';
import { DynStiffnessChartComponent } from '../@core/results/dyn-stiffness-chart';
import { DynStiff2dChartComponent } from '../@core/results/dyn-stiff2d-chart';

@NgModule({
  imports: [
    RotordynRoutingModule,
    ThemeModule,
    PlotlyModule,
    SharedModule,
    ModalModule,
  ],
  declarations: [
    EditorLayoutComponent,
    RotordynLayoutComponent,
    CleanLayoutComponent,
    DynToolbarComponent,
    RotordynComponent,
    RotordynListComponent,
    RotordynRunComponent,
    RotordynEditComponent,
    RotordynEdit3dComponent,
    RotordynDetailComponent,
    RotordynFormComponent,
    RotordynCreateComponent,
    // DynSwitcherComponent,
    NumberInputComponent,
    NumInputComponent,
    // DynButtonComponent,
    ShowErrorsComponent,
    DynSvgComponent,
    TwoViewerComponent,
    DynNodeComponent,
    SettingsComponent,
    // ProjectErrorsComponent,
    ProjectSettingsComponent,
    SectionComponent,
    DiscComponent,
    InertiaComponent,
    RollerComponent,
    RibComponent,
    FoundationComponent,
    JournalComponent,
    VesComponent,
    SheetComponent,
    SheetMaterialComponent,
    SheetRotationComponent,
    SheetTranslationComponent,
    RotationComponent,
    JournalOptimizationComponent,
    JournalPropertiesComponent,
    CampbellComponent,
    StiffnessComponent,
    ModesComponent,
    UnbalanceComponent,
    ConstantComponent,
    TorsionalComponent,
    TimeComponent,
    ResultForceComponent,
    ResultPhaseComponent,
    ResultResponseComponent,
    ResultTorkComponent,
    DynLineChartComponent,
    DynCampbellChartComponent,
    DynInstabilityChartComponent,
    DynCampbell3DChartComponent,
    DynEstabilitiesChartComponent,
    DynConstantChartComponent,
    DynUnbalanceChartComponent,
    DynUnbChartComponent,
    DynTorsionalChartComponent,
    DynModesChartComponent,
    DynTimeChartComponent,
    DynStiffnessChartComponent,
    DynStiff2dChartComponent,
  ],
  entryComponents: [ SectionComponent, DiscComponent, InertiaComponent, RollerComponent, RibComponent, FoundationComponent, JournalComponent, VesComponent, SheetComponent, SheetMaterialComponent, SheetRotationComponent, SheetTranslationComponent, RotationComponent, JournalOptimizationComponent, JournalPropertiesComponent, CampbellComponent, StiffnessComponent, ModesComponent, UnbalanceComponent, ConstantComponent, TorsionalComponent, TimeComponent ],
})

export class RotordynModule { }
