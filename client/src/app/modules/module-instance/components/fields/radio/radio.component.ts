import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

@Component({
  selector: 'jms-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent extends FieldComponent<FieldData>
  implements OnInit {
  ngOnInit() {
    console.log(this.cData.control.value);
  }
}
