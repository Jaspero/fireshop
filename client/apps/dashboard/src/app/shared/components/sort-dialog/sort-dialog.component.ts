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
import {from, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

interface Item {
  id: string;
  [key: string]: any;
}

@Component({
  selector: 'jfsc-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortDialogComponent<T = Item> implements OnInit {
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

  private _originals: {[key: string]: number};

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
        map(actions => {
          const {data, originals} = actions.reduce(
            (acc, action) => {
              const item = {
                id: action.payload.doc.id,
                ...action.payload.doc.data()
              };

              acc.data.push(item);
              acc.originals[item.id] = item[this.data.sortKey];

              return acc;
            },
            {
              data: [],
              originals: {}
            }
          );

          this._originals = originals;

          return data;
        })
      );
  }

  drop(items: T[], event: CdkDragDrop<string[]>) {
    moveItemInArray(items, event.previousIndex, event.currentIndex);
  }

  move(up = false, items: T[], index: number) {
    const currentIndex = up ? index - 1 : index + 1;
    moveItemInArray(items, index, currentIndex);
  }

  update(items: Item[]) {
    return () => {
      const batch = this.afs.firestore.batch();

      items.forEach((item, index) => {
        if (index !== this._originals[item.id]) {
          const {ref} = this.afs.collection(this.data.collection).doc(item.id);

          batch.set(
            ref,
            {
              [this.data.sortKey]: index
            },
            {
              merge: true
            }
          );
        }
      });

      return from(batch.commit()).pipe(
        notify(),
        tap(() => this.dialogRef.close())
      );
    };
  }
}
