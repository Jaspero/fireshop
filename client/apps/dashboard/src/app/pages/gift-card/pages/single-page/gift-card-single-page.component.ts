import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';
import * as nanoid from 'nanoid';
import {notify} from '@jf/utils/notify.operator';
import {tap} from 'rxjs/operators';
import {toStripeFormat} from '@jf/utils/stripe-format';

@Component({
  selector: 'jfsc-gift-card-single-page',
  templateUrl: './gift-card-single-page.component.html',
  styleUrls: ['./gift-card-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardSinglePageComponent extends SinglePageComponent {
  collection = FirestoreCollections.GiftCards;
  values = [10, 25, 50, 100, 200];

  buildForm(data) {
    this.form = this.fb.group({
      id: [nanoid(), Validators.required],
      value: [data.value || '', Validators.required]
    });
  }

  save() {
    return () => {
      const {id, ...item} = this.form.getRawValue();
      item.value = toStripeFormat(item.value);
      this.initialValue = this.form.getRawValue();
      delete this.initialValue.id;
      return this.getSaveData(id, item).pipe(
        notify(),
        tap(() => {
          this.back();
        })
      );
    };
  }
}
