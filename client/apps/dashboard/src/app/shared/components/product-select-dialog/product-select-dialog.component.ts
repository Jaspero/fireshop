import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RxDestroy} from '@jaspero/ng-helpers';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Product} from '@jf/interfaces/product.interface';
import {forkJoin} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'jfsc-product-select-dialog',
  templateUrl: './product-select-dialog.component.html',
  styleUrls: ['./product-select-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSelectDialogComponent extends RxDestroy implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      title?: string;
      selected?: string[];
    },
    private dialogRef: MatDialogRef<ProductSelectDialogComponent>,
    private afs: AngularFirestore,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  title = 'Product Selection';
  selected: Product[] = [];
  loading = true;
  search = new FormControl('');

  ngOnInit() {
    if (this.data.title) {
      this.title = this.data.title;
    }

    if (this.data.selected && this.data.selected.length) {
      forkJoin(
        this.data.selected.map(id =>
          this.afs
            .collection(
              `${FirestoreCollections.Products}-${STATIC_CONFIG.lang}`
            )
            .doc(id)
            .get()
        )
      )
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          this.selected = res.reduce((acc, cur) => {
            if (cur.exists) {
              acc.push({
                id: cur.id,
                ...cur.data()
              });
            }

            return acc;
          }, []);
          this.loading = false;
          this.cdr.markForCheck();
        });
    } else {
      this.selected = [];
      this.loading = false;
    }
  }

  save() {
    this.dialogRef.close(this.selected.map(it => it.id));
  }

  optionSelected(product: Product) {
    if (!this.selected.some(it => it.id === product.id)) {
      this.selected.push(product);
    }
    this.cdr.markForCheck();
  }

  drop(event: CdkDragDrop<Product>) {
    moveItemInArray(this.selected, event.previousIndex, event.currentIndex);
  }

  unselect(index: number) {
    this.selected.splice(index, 1);
    this.cdr.markForCheck();
  }
}
