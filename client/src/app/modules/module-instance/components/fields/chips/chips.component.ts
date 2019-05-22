import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {FieldComponent, FieldData} from '../../field/field.component';

interface ChipsData extends FieldData {
  selectable: boolean;
  removable: boolean;
  addOnBlur: boolean;
}

@Component({
  selector: 'jms-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsComponent extends FieldComponent<ChipsData>
  implements OnInit {
  data = this.cData.control.value;

  ngOnInit() {
    this.cData.control.setValue([]);
  }

  add(event: MatChipInputEvent) {
    const value = event.value;
    const input = event.input;

    if ((value || '').trim()) {
      this.data.push(value.trim());
      this.cData.control.setValue(this.data);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(chip) {
    this.cData.control.setValue(this.data);

    const index = this.cData.control.value.indexOf(chip);

    if (index >= 0) {
      this.data.splice(index, 1);
    }
  }
}
