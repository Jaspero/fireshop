import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

@Component({
  selector: 'jms-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent extends FieldComponent<FieldData> {
  options = [
    {value: 'one', label: 'ONE'},
    {value: 'two', label: 'TWO'},
    {value: 'three', label: 'THREE'}
  ];
}
