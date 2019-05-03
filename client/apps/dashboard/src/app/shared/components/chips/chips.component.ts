import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'jfsc-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsComponent {
  constructor() {}

  @Input()
  chips$: Observable<{key: string; value: string}>;

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
}
