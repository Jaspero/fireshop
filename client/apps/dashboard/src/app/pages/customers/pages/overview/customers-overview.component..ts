import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'jfsc-overview',
  templateUrl: './customers-overview.component.html',
  styleUrls: ['./customers-overview.component.css']
})
export class CustomersOverviewComponent implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  data$: Observable<{
    id: string
  }>;

  ngOnInit() {

    this.data$ = this.activatedRoute.params
      .pipe(
        map(params => ({id: params.id}))
      )

    // this.afs
    //   .collection(FirestoreCollections.Reviews, ref => {
    //     return ref.where(
    //       'customerId',
    //       FirebaseOperator.Equal,
    //       this.acr.params.value.id
    //     );
    //   })
    //   .get()
    //   .subscribe(val => {});
  }
}
