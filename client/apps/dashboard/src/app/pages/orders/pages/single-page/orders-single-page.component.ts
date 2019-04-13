import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs/operators';
import {of} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {MatSort, MatTableDataSource} from '@angular/material';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './orders-single-page.component.html',
  styleUrls: ['./orders-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersSinglePageComponent extends RxDestroy implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

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
}
