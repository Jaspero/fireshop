import {PortalModule} from '@angular/cdk/portal';
import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
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
  ConfirmationComponent,
  InputComponent,
  FieldComponent,
  SelectComponent,
  ImageComponent,
  GalleryComponent
];

@NgModule({
  declarations: [AppComponent, ...PAGES, ...COMPONENTS, ...ENTRY_COMPONENTS],
  entryComponents: [...ENTRY_COMPONENTS],
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

    // Ng Helpers
    LoadClickModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
