import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {RxDestroy} from '@jaspero/ng-helpers';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';

@Component({
  selector: 'jfsc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent extends RxDestroy implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {
    super();
  }

  list: any;
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['customerId', 'orderId', 'price', 'quantity', 'time'];
  productStats = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          return this.afs
            .collection(`${FirestoreCollections.OrderedItems}`, ref => {
              return ref.where('identifier', FirebaseOperator.Equal, params.id);
            })
            .snapshotChanges();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(actions => {
        this.dataSource.data = actions.map(action => ({
          id: action.payload.doc.id,
          ...action.payload.doc.data()
        }));
        this.productStats = this.dataSource.data.reduce((acc, cur) => {
          acc['name'] = cur['name'];
          acc['earn'] = acc['earn'] ? acc['earn'] + cur['price'] : cur['price'];
          acc['num'] = acc['num']
            ? acc['num'] + cur['quantity']
            : cur['quantity'];
          return acc;
        }, {});
      });
  }
}
