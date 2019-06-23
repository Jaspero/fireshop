import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {forkJoin, from, Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {SortModule} from '../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {notify} from '../../../../shared/utils/notify.operator';
import {switchItemLocations} from '../../utils/switch-item-locations';

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
    private dbService: DbService
  ) {}

  items$: Observable<any>;

  ngOnInit() {
    this.items$ = this.dbService.getDocumentsSimple(
      this.data.collection,
      this.data.options.sortKey
    );
  }

  drop(items: any[], event: CdkDragDrop<string[]>) {
    this.update(items, event.previousIndex, event.currentIndex);
    switchItemLocations(items, event.previousIndex, event.currentIndex);
  }

  move(up = false, items: any[], index: number) {
    const currentIndex = up ? index - 1 : index + 1;
    this.update(items, index, currentIndex);
    switchItemLocations(items, index, currentIndex);
  }

  update(items: any[], previousIndex: number, currentIndex: number) {
    forkJoin([
      from(
        this.dbService.setDocument(
          this.data.collection,
          items[previousIndex].id,
          {
            [this.data.options.sortKey]: currentIndex
          },
          {
            merge: true
          }
        )
      ),
      from(
        this.dbService.setDocument(
          this.data.collection,
          items[currentIndex].id,
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
