import {ChangeDetectionStrategy, Component, Injector, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {OnChange} from '@jaspero/ng-helpers';
import {JSONSchema7} from 'json-schema';
import {InstanceSingleState} from '../../../modules/module-instance/enums/instance-single-state.enum';
import {SegmentType} from '../../../modules/module-instance/enums/segment-type.enum';
import {compileSegment} from '../../../modules/module-instance/utils/compile-segment';
import {Parser} from '../../../modules/module-instance/utils/parser';
import {CompiledSegment} from '../../interfaces/compiled-segment.interface';
import {InstanceSegment, ModuleDefinitions} from '../../interfaces/module.interface';

@Component({
  selector: 'jms-compiled-form',
  templateUrl: './compiled-form.component.html',
  styleUrls: ['./compiled-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompiledFormComponent implements OnInit {
  constructor(
    private injector: Injector
  ) { }

  @Input()
  data: {
    value?: any,
    schema: JSONSchema7,
    definitions?: ModuleDefinitions,
    segments?: InstanceSegment[];
  };

  @OnChange(function(value) {
    if (this.form) {
      this.form.patchValue(value);
    }
  })
  @Input()
  value: any;

  form: FormGroup;
  segments: CompiledSegment[];

  ngOnInit() {

    const value = this.data.value || {};
    const definitions = this.data.definitions || {};

    const parser = new Parser(
      this.data.schema,
      this.injector,
      InstanceSingleState.Create,
      definitions
    );

    this.form = parser.buildForm(
      value,
      [],
      '/',
      false
    );

    this.segments = (
      this.data.segments ||
      [{
        title: '',
        fields: Object.keys(parser.pointers),
        columnsDesktop: 12,
        type: SegmentType.Empty
      }]
    ).map(segment =>
      compileSegment(
        segment,
        parser,
        definitions,
        this.injector,
          value
      )
    );
  }

}
