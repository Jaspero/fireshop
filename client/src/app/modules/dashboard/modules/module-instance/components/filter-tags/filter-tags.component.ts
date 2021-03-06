import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {BehaviorSubject} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {WhereFilter} from '../../../../../../shared/interfaces/where-filter.interface';

@UntilDestroy()
@Component({
  selector: 'jms-filter-tags',
  templateUrl: './filter-tags.component.html',
  styleUrls: ['./filter-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterTagsComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef
  ) {}

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
        untilDestroyed(this)
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
      return value !== undefined && value !== null && value !== '';
    }
  }

  removeItem(items: WhereFilter[], index: number) {

    const removed = [...items];

    removed.splice(index, 1);

    this.items$.next(removed);
  }
}
