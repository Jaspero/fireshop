import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {FieldData} from '../../../interfaces/field-data.interface';
import {FieldComponent} from '../../field/field.component';

interface ChipsData extends FieldData {
  selectable: boolean;
  removable: boolean;
  addOnBlur: boolean;
  unique: boolean;
}

@Component({
  selector: 'jms-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsComponent extends FieldComponent<ChipsData>
  implements OnInit {
  data = [];

  ngOnInit() {
    this.data = this.cData.control.value;
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    const input = event.input;

    if (value && (this.cData.unique ? !this.data.includes(value) : true)) {
      this.data.push(value);
      this.cData.control.setValue(this.data);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(chip) {
    const index = this.cData.control.value.indexOf(chip);

    if (index >= 0) {
      this.data.splice(index, 1);
      this.cData.control.setValue(this.data);
    }
  }
}
