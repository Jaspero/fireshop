import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MAT_DIALOG_DATA} from '@angular/material';
import {forkJoin, from, Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {SortModule} from '../../../../shared/interfaces/module.interface';
import {notify} from '../../../../shared/utils/notify.operator';

@Component({
  selector: 'jms-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      options: SortModule;
      collection: string;
      collectionName: string;
    },
    private afs: AngularFirestore
  ) {}

  items$: Observable<any>;

  ngOnInit() {
    this.items$ = this.afs
      .collection(this.data.collection, ref =>
        ref.orderBy(this.data.options.sortKey)
      )
      .valueChanges('id')
      .pipe(take(1));
  }

  drop(items: any[], event: CdkDragDrop<string[]>) {
    this.update(items, event.previousIndex, event.currentIndex);

    moveItemInArray(items, event.previousIndex, event.currentIndex);
  }

  move(up = false, items: any[], index: number) {
    const currentIndex = up ? index - 1 : index + 1;

    this.update(items, index, currentIndex);

    moveItemInArray(items, index, currentIndex);
  }

  update(items: any[], previousIndex: number, currentIndex: number) {
    forkJoin([
      from(
        this.afs
          .collection(this.data.collection)
          .doc(items[previousIndex].id)
          .set(
            {
              [this.data.options.sortKey]: currentIndex
            },
            {
              merge: true
            }
          )
      ),
      from(
        this.afs
          .collection(this.data.collection)
          .doc(items[currentIndex].id)
          .set(
            {
              [this.data.options.sortKey]: previousIndex
            },
            {
              merge: true
            }
          )
      )
    ])
      .pipe(
        take(1),
        notify({
          success: null
        })
      )
      .subscribe();
  }
}
