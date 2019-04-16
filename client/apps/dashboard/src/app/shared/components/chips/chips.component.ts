import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'jfs-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsComponent {
  constructor() { }

  @Input()
  chips$: Observable<any>;

  @Output() filterValue = new EventEmitter<any>();

  removeChip(chip) {
    this.filterValue.emit(chip)
  }

  haveLength(chips) {
    return Object.entries(chips).find(item => item[1]);
  }
}
