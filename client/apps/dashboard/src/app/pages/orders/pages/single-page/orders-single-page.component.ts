import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatSort} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './orders-single-page.component.html',
  styleUrls: ['./orders-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersSinglePageComponent extends SinglePageComponent
  implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [
    'name',
    'customerId',
    'identifier',
    'orderId',
    'price',
    'productId',
    'quantity'
  ];
  order: any;

  collection = FirestoreCollections.Orders;

  buildForm() {
    this.form = this.fb.group({
      product: ['', Validators.required],
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      address: ['', Validators.required]
    });
  }
}
