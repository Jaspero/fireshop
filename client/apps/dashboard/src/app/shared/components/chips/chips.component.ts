import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Observable} from 'rxjs';

type chipValue = string | {id: string; name: string};

@Component({
  selector: 'jfsc-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsComponent {
  constructor() {}

  @Input()
  chips$: Observable<{key: string; value: chipValue}>;

  @Output()
  filterValue = new EventEmitter<string>();

  removeChip(chip) {
    this.filterValue.emit(chip.key);
  }

  haveLength(chips) {
    return Object.entries(chips).some(
      item => item[1] !== null && item[1] !== ''
    );
  }

  getValue(value: chipValue) {
    if (typeof value === 'string') {
      return value;
    } else {
      return value.name;
    }
  }
}
