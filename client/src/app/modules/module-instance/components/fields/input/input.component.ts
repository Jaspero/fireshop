import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FieldData} from '../../../interfaces/field-data.interface';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {safeEval} from '../../../utils/safe-eval';
import {FieldComponent} from '../../field/field.component';

interface InputData extends FieldData {
  type: 'text' | 'number' | 'email';
  autocomplete?: string;
  suffix?: {
    type?: 'html' | 'static' | 'dynamic';
    value: string;
  };
  prefix?: {
    type?: 'html' | 'static' | 'dynamic';
    value: string;
  };
}

@Component({
  selector: 'jms-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends FieldComponent<InputData> implements OnInit {
  constructor(
    @Inject(COMPONENT_DATA) public cData: InputData,
    private cdr: ChangeDetectorRef
  ) {
    super(cData);
  }

  prefix: string;
  suffix: string;

  ngOnInit() {
    ['prefix', 'suffix'].forEach(key => {
      if (this.cData[key]) {

        let item;

        switch (this.cData[key].type) {
          case 'dynamic':
            item = safeEval(this.cData[key].value);

            if (item) {
              this.cData.form.valueChanges.subscribe(value => {
                this[key] = item(
                  this.cData.control.value,
                  value
                );
                this.cdr.markForCheck();
              });
            }

            break;
          case 'static':
            item = safeEval(this.cData[key].value);

            if (item) {
              this[key] = item(
                this.cData.control.value,
                this.cData.form.getRawValue()
              );
            }
            break;
          case 'html':
          default:
            this[key] = this.cData[key].value;
            break;
        }
      }
    });
  }
}
