import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSort} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {OrderStatus} from '@jf/enums/order-status.enum';
import {Product} from '@jf/interfaces/product.interface';
import {fromStripeFormat} from '@jf/utils/stripe-format';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, startWith, takeUntil} from 'rxjs/operators';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './orders-single-page.component.html',
  styleUrls: ['./orders-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersSinglePageComponent extends SinglePageComponent
  implements OnInit {
  collection = FirestoreCollections.Orders;
  deliveryStatus = OrderStatus;
  product$: Observable<Product[]>;
  search = new FormControl('');
  filteredProducts$: Observable<Product[]>;
  @ViewChild('addProduct', {static: true})
  addProduct: TemplateRef<any>;
  productForm: FormGroup;
  orderItems = [];

  ngOnInit() {
    super.ngOnInit();

    this.product$ = this.afs
      .collection<Product>(`${FirestoreCollections.Products}-en`)
      .valueChanges('id');

    this.filteredProducts$ = combineLatest(
      this.product$,
      this.search.valueChanges.pipe(
        startWith(this.search.value || ''),
        map(value => value.toLowerCase())
      )
    ).pipe(
      map(([products, value]) =>
        products.filter(product =>
          (product.name || '').toLowerCase().includes(value)
        )
      )
    );
  }

  selectedProduct(event) {
    this.productForm.get('product').setValue({
      id: event.option.id,
      name: event.option.value,
      price: Number(event.option._element.nativeElement.dataset.price)
    });
  }

  buildForm(data: any) {
    if (data.orderItemsData) {
      this.orderItems = data.orderItemsData.map((val, ind) => ({
        data: val,
        id: data.orderItems[ind]
      }));
    }

    this.form = this.fb.group({
      billing: this.checkForm(data.billing ? data.billing : {}),
      shippingInfo: data.shippingInfo || true,
      email: data.email || '',
      id: data.id || '',
      paymentIntentId: {value: data.paymentIntentId || '', disabled: true},
      price: data.price ? fromStripeFormat(data.price.total) : '',
      status: data.status || '',

      /**
       * Map to customerName and customerId
       * when saving
       */
      customerInfo: data.customerId
        ? {
            name: data.customerName,
            id: data.customerId
          }
        : ''
    });

    this.form
      .get('shippingInfo')
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        if (value) {
          this.form.removeControl('shipping');
        } else {
          this.form.addControl(
            'shipping',
            this.checkForm(value.shipping || {})
          );
        }
      });
  }

  getSaveData(...args) {
    if (Object.keys(args[1].customerInfo).length > 0) {
      args[1]['customerName'] = args[1].customerInfo.name;
      args[1]['customerId'] = args[1].customerInfo.id;
    }
    args[1]['orderItems'] = [];
    args[1]['orderItemsData'] = [];
    this.orderItems.forEach(item => {
      args[1]['orderItems'].push(item.id);
      args[1]['orderItemsData'].push(item.data);
    });
    delete args[1].customerInfo;
    return super.getSaveData(...args);
  }

  checkForm(data: any) {
    return this.fb.group({
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || '',
      zip: data.zip || '',
      country: data.country || '',
      line1: data.line1 || '',
      line2: data.line2 || ''
    });
  }

  openProductDialog(product = null) {
    this.productForm = this.fb.group({
      product: product
        ? this.fb.group({
            id: [product.id, Validators.required],
            name: [product.data.name, Validators.required],
            price: [Number(product.data.quantity), Validators.required]
          })
        : this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            price: ['', Validators.required]
          }),
      quantity: [
        product ? Number(product.data.quantity) : '',
        Validators.required
      ]
    });
    product
      ? this.search.setValue(product.data.name)
      : this.search.setValue('');
    this.dialog
      .open(this.addProduct, {
        width: '400px'
      })
      .afterClosed()
      .pipe(filter(val => !!val))
      .subscribe(() => {
        const itemToAdd = this.productForm.getRawValue();
        const ind = this.orderItems.findIndex(
          val => val.id === itemToAdd.product.id
        );
        if (ind === -1) {
          this.orderItems.push({
            data: {
              name: itemToAdd.product.name,
              quantity: itemToAdd.quantity,
              price: itemToAdd.product.price
            },
            id: itemToAdd.product.id
          });
        } else {
          this.orderItems[ind].data.quantity += itemToAdd.quantity;
        }
        this.cdr.detectChanges();
      });
  }

  itemGroup(data) {
    return {
      id: data.productId || '',
      quantity: data.quantity || '',
      price: data.price || '',
      name: data.name || ''
    };
  }

  deleteItem(i) {
    this.orderItems.splice(i, 1);
  }
}
