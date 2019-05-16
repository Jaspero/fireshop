import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {forkJoin, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {log} from 'util';

@Component({
  selector: 'jfsc-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.scss']
})
export class OrderOverviewComponent implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  data$: Observable<any>;

  // this.afs.collection(`${FirestoreCollections.Products}-${STATIC_CONFIG.lang}`)

  ngOnInit() {
    this.data$ = this.activatedRoute.params.pipe(
      switchMap(identifier =>
        this.afs
          .collection(FirestoreCollections.Orders)
          .doc(identifier.id)
          .get()
          .pipe(
            map(res => ({
              id: res.id,
              ...res.data()
            }))
          )
      )
    );
  }
}
