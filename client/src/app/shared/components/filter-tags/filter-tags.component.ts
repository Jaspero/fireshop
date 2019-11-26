import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {RxDestroy} from '@jaspero/ng-helpers';
import {BehaviorSubject} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';
import {WhereFilter} from '../../interfaces/where-filter.interface';

@Component({
  selector: 'jms-filter-tags',
  templateUrl: './filter-tags.component.html',
  styleUrls: ['./filter-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterTagsComponent extends RxDestroy implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  @Input()
  items$: BehaviorSubject<WhereFilter[]>;

  @Input()
  search: FormControl;

  searchValue: string;

  ngOnInit() {
    this.search
      .valueChanges
      .pipe(
        startWith(this.search.value),
        takeUntil(this.destroyed$)
      )
      .subscribe(value => {
        this.searchValue = value;
        this.cdr.markForCheck();
      });
  }

  displayValue(value: any) {
    if (Array.isArray(value)) {
      return value.join(',');
    } else {
      return value;
    }
  }

  showTag(value: any) {
    if (Array.isArray(value)) {
      return value.length;
    } else {
      return value;
    }
  }

  removeItem(items: WhereFilter[], index: number) {

    const removed = [...items];

    removed.splice(index, 1);

    this.items$.next(removed);
  }
}
