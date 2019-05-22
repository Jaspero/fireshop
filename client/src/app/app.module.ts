import {PortalModule} from '@angular/cdk/portal';
import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {ENV_CONFIG} from '../env-config';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './modules/login/login.component';
import {ModuleDefinitionComponent} from './modules/module-definition/module-definition.component';
import {DefinitionInstanceComponent} from './modules/module-definition/pages/definition-instance/definition-instance.component';
import {DefinitionOverviewComponent} from './modules/module-definition/pages/definition-overview/definition-overview.component';
import {ModuleInstanceComponent} from './modules/module-instance/module-instance.component';
import {InstanceOverviewComponent} from './modules/module-instance/pages/instance-overview/instance-overview.component';
import {InstanceSingleComponent} from './modules/module-instance/pages/instance-single/instance-single.component';
import {ResetPasswordComponent} from './modules/reset-password/reset-password.component';
import {ConfirmationComponent} from './shared/components/confirmation/confirmation.component';
import {JsonEditorComponent} from './shared/components/json-editor/json-editor.component';
import {SearchInputComponent} from './shared/components/search-input/search-input.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {InputComponent} from './modules/module-instance/components/fields/input/input.component';
import {FieldComponent} from './modules/module-instance/components/field/field.component';
import {SettingsComponent} from './modules/settings/settings.component';
import {SelectComponent} from './modules/module-instance/components/fields/select/select.component';
import {ImageComponent} from './modules/module-instance/components/fields/image/image.component';
import {GalleryComponent} from './modules/module-instance/components/fields/gallery/gallery.component';
import {LayoutComponent} from './shared/components/layout/layout.component';
import {SegmentComponent} from './modules/module-instance/components/segment/segment.component';
import {EmptyComponent} from './modules/module-instance/components/segments/empty/empty.component';
import {CardComponent} from './modules/module-instance/components/segments/card/card.component';
import {AccordionComponent} from './modules/module-instance/components/segments/accordion/accordion.component';
import {TabsComponent} from './modules/module-instance/components/segments/tabs/tabs.component';
import {StepperComponent} from './modules/module-instance/components/segments/stepper/stepper.component';
import {ForceDisableDirective} from './shared/directives/force-disable/force-disable.directive';
import {ColumnPipe} from './modules/module-instance/pipes/column.pipe';
import {ToggleComponent} from './modules/module-instance/components/fields/toggle/toggle.component';
import {CheckboxComponent} from './modules/module-instance/components/fields/checkbox/checkbox.component';
import {DateFieldComponent} from './modules/module-instance/components/fields/date-field/date-field.component';
import {SliderComponent} from './modules/module-instance/components/fields/slider/slider.component';
import {RadioComponent} from './modules/module-instance/components/fields/radio/radio.component';

const PAGES = [
  ModuleDefinitionComponent,
  ModuleInstanceComponent,
  InstanceSingleComponent,
  InstanceOverviewComponent,
  DefinitionOverviewComponent,
  DefinitionInstanceComponent,
  SettingsComponent,
  DashboardComponent,

  LoginComponent,
  ResetPasswordComponent
];

const COMPONENTS = [SearchInputComponent, JsonEditorComponent, LayoutComponent];

const ENTRY_COMPONENTS = [
  // Fields
  FieldComponent,
  ConfirmationComponent,
  InputComponent,
  SelectComponent,
  ImageComponent,
  GalleryComponent,
  ToggleComponent,
  CheckboxComponent,
  DateFieldComponent,
  SliderComponent,
  RadioComponent,

  // Segments
  SegmentComponent,
  CardComponent,
  EmptyComponent,
  AccordionComponent,
  TabsComponent,
  StepperComponent
];

const DIRECTIVES = [ForceDisableDirective];

const PIPES = [ColumnPipe];

@NgModule({
  declarations: [
    AppComponent,
    ...PAGES,
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  entryComponents: ENTRY_COMPONENTS,
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    /**
     * External
     */
    AngularFireModule.initializeApp(ENV_CONFIG.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,

    // Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSelectModule,
    PortalModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatRadioModule,

    // Ng Helpers
    LoadClickModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  bootstrap: [AppComponent]
})
export class AppModule {}
