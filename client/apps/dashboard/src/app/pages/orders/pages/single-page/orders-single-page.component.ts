import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {of} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
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
  dataSource = new MatTableDataSource();
  order: any;

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params.id !== 'new') {
            return this.afs
              .collection(`${FirestoreCollections.Orders}`)
              .doc(params.id)
              .valueChanges();
          } else {
            return of({});
          }
        }),
        switchMap(res => {
          if (res['orderId']) {
            this.order = res;
            return this.afs
              .collection(`${FirestoreCollections.OrderedItems}`, ref => {
                return ref.where(
                  'orderId',
                  FirebaseOperator.Equal,
                  res['orderId']
                );
              })
              .snapshotChanges();
          } else {
            return of({});
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((val: any) => {
        this.dataSource.data = val.map(action => ({
          id: action.payload.doc.id,
          ...action.payload.doc.data()
        }));
        this.cdr.detectChanges();
      });
  }

  buildForm() {
    this.form = this.fb.group({
      product: ['', Validators.required],
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      address: ['', Validators.required]
    });
  }
}
