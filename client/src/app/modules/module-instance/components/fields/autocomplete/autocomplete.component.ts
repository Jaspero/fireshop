import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface AutocompleteData extends FieldData {
  options: Array<{
    value: any;
    label: string;
  }>;
}

@Component({
  selector: 'jms-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent extends FieldComponent<AutocompleteData>
  implements OnInit {
  ngOnInit() {
    this.cData.control.setValue('');

    this.cData.control.valueChanges.subscribe(val => {
      for (let i = 0; i < this.cData['options'].length; i++) {
        if (!this.cData['options'][i].value.includes(val)) {
          this.cData['options'].splice(i, 1);
        }
      }
    });
  }
}
