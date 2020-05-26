import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {
  ClickOutsideModule,
  EnumKeyFormatModule,
  EnumModule,
  FormTouchOnHoverModule,
  LoadClickModule,
  SanitizeModule,
  StopPropagationModule
} from '@jaspero/ng-helpers';
import {JpImagePreloadModule} from '@jaspero/ng-image-preload';
import {JpSliderModule} from '@jaspero/ng-slider';
import {ColorPickerComponent} from '@jf/components/color-picker/color-picker.component';
import {ConfirmationComponent} from '@jf/components/confirmation/confirmation.component';
import {RatingScaleComponent} from '@jf/components/rating-scale/rating-scale.component';
import {NgxJsonLdModule} from '@ngx-lite/json-ld';
import {LoginSignupDialogComponent} from './components/login-signup-dialog/login-signup-dialog.component';
import {NetworkWidgetComponent} from './components/network-widget/network-widget.component';
import {ProductCardComponent} from './components/product-card/product-card.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CartComponent} from './components/cart/cart.component';
import {ReviewCardComponent} from './components/review-card/review-card.component';
import {ReviewsDialogComponent} from './components/reviews/reviews-dialog.component';
import {SearchComponent} from './components/search/search.component';
import {LibraryImageDirective} from '@jf/directives/library-image.directive';
import {StripePipe} from '@jf/pipes/stripe.pipe';
import {LightboxComponent} from './components/lightbox/lightbox.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {OrderByValuePipe} from './pipes/orderByValue.pipe';

const MODULES = [
  CommonModule,
  HttpClientModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,

  // Material
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatMenuModule,
  MatBadgeModule,
  MatTooltipModule,
  MatSelectModule,
  MatSliderModule,
  ScrollingModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonToggleModule,
  MatDividerModule,
  MatListModule,
  MatRippleModule,
  MatCardModule,
  MatChipsModule,
  MatTabsModule,
  MatExpansionModule,
  MatStepperModule,

  // AngularFire
  AngularFirestoreModule,

  // https://github.com/Jaspero/ng-helpers
  FormTouchOnHoverModule,
  StopPropagationModule,
  ClickOutsideModule,
  EnumModule,
  EnumKeyFormatModule,
  SanitizeModule,
  LoadClickModule,

  JpSliderModule,
  JpImagePreloadModule,
  NgxJsonLdModule
];
const ENTRY_COMPONENTS = [
  ColorPickerComponent,
  ConfirmationComponent,
  LoginSignupDialogComponent,
  CartComponent,
  SearchComponent,
  ReviewsDialogComponent,
  RatingScaleComponent,
  LightboxComponent
];
const COMPONENTS = [
  NetworkWidgetComponent,
  ReviewCardComponent,
  ProductCardComponent,
  ...ENTRY_COMPONENTS
];
const DIRECTIVES = [LibraryImageDirective];
const PIPES = [StripePipe, OrderByValuePipe];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES],
  imports: [...MODULES],
  exports: [...MODULES, ...COMPONENTS, ...DIRECTIVES, ...PIPES]
})
export class SharedModule {}
