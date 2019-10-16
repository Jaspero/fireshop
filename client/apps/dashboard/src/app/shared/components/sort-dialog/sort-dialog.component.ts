import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  TemplateRef
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {notify} from '@jf/utils/notify.operator';
import {forkJoin, from, Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortDialogComponent<T = any> implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      sortKey: string;
      collection: string;
      title: string;
      templateRef: TemplateRef<any>;
    },
    private afs: AngularFirestore,
    private dialogRef: MatDialogRef<SortDialogComponent>
  ) {}

  title = 'Sort Items';
  templateRef?: TemplateRef<any>;
  items$: Observable<T[]>;
  updateMap: {[key: string]: number} = {};

  ngOnInit() {
    if (!this.data.sortKey) {
      this.data.sortKey = 'order';
    }

    if (this.data.title) {
      this.title = this.data.title;
    }

    if (this.data.templateRef) {
      this.templateRef = this.data.templateRef;
    }

    this.items$ = this.afs
      .collection<T>(this.data.collection, ref =>
        ref.orderBy(this.data.sortKey, 'asc')
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => ({
            id: action.payload.doc.id,
            ...action.payload.doc.data()
          }))
        )
      );
  }

  drop(items: any[], event: CdkDragDrop<string[]>) {
    this.updateMap[items[event.previousIndex].id] = event.currentIndex;
    this.updateMap[items[event.currentIndex].id] = event.previousIndex;
    moveItemInArray(items, event.previousIndex, event.currentIndex);
  }

  move(up = false, items: any[], index: number) {
    const currentIndex = up ? index - 1 : index + 1;
    this.updateMap[items[index].id] = currentIndex;
    this.updateMap[items[currentIndex].id] = index;
    moveItemInArray(items, index, currentIndex);
  }

  update() {
    return () => {
      const data = Object.entries(this.updateMap);

      if (!data.length) {
        return of([]);
      }

      console.log('data', data);

      return forkJoin(
        data.map(([id, order]) =>
          from(
            this.afs
              .collection(this.data.collection)
              .doc(id)
              .set(
                {
                  [this.data.sortKey]: order
                },
                {
                  merge: true
                }
              )
          )
        )
      ).pipe(
        notify(),
        tap(() => this.dialogRef.close())
      );
    };
  }
}
