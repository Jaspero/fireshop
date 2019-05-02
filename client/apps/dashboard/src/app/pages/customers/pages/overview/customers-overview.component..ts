import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';

@Component({
  selector: 'jfsc-overview',
  templateUrl: './customers-overview.component.html',
  styleUrls: ['./customers-overview.component.css']
})
export class CustomersOverviewComponent implements OnInit {
  constructor(public acr: ActivatedRoute, private afs: AngularFirestore) {}

  ngOnInit() {
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
