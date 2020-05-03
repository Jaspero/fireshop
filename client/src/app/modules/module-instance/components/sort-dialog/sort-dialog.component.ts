import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {switchItemLocations} from '@jaspero/form-builder';
import {forkJoin, from, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {SortModule} from '../../../../shared/interfaces/sort-module.interface';
import {DbService} from '../../../../shared/services/db/db.service';
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
    private dbService: DbService,
    private dialogRef: MatDialogRef<SortDialogComponent>
  ) {}

  items$: Observable<any>;
  updateMap: {[key: string]: number} = {};

  ngOnInit() {
    this.items$ = this.dbService.getDocumentsSimple(
      this.data.collection,
      this.data.options.sortKey
    );
  }

  drop(items: any[], event: CdkDragDrop<string[]>) {
    this.updateMap[items[event.previousIndex].id] = event.currentIndex;
    this.updateMap[items[event.currentIndex].id] = event.previousIndex;
    switchItemLocations(items, event.previousIndex, event.currentIndex);
  }

  move(up = false, items: any[], index: number) {
    const currentIndex = up ? index - 1 : index + 1;
    this.updateMap[items[index].id] = currentIndex;
    this.updateMap[items[currentIndex].id] = index;
    switchItemLocations(items, index, currentIndex);
  }

  update() {
    return () => {
      const data = Object.entries(this.updateMap);

      if (!data.length) {
        return of([]);
      }

      return forkJoin(
        data.map(([id, order]) =>
          from(
            this.dbService.setDocument(
              this.data.collection,
              id,
              {
                [this.data.options.sortKey]: order
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
