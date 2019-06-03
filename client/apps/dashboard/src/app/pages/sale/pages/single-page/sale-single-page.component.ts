import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {fromStripeFormat} from '@jf/utils/stripe-format';
import {LangSinglePageComponent} from '../../../../shared/components/lang-single-page/lang-single-page.component';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';

@Component({
  selector: 'jfsc-sale-single-page',
  templateUrl: './sale-single-page.component.html',
  styleUrls: ['./sale-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleSinglePageComponent extends LangSinglePageComponent {
  collection = FirestoreCollections.Sales;

  public buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.currentState === this.viewState.Edit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      description: [data.description || ''],
      fixed: [data.fixed || false, Validators.required],
      value: [data.value ? fromStripeFormat(data.value) : 0, Validators.min(0)],
      startingDate: [data.startingDate || ''],
      endingDate: [data.endingDate || ''],
      limited: [data.limited || ''],
      active: [data.active || true, Validators.required],
      ribbonProduct: [data.ribbonProduct || true],
      limitedNumber: [data.limitedNumber || '']
    });
  }
}
