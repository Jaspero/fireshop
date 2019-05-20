import {ComponentPortal} from '@angular/cdk/portal';
import {Injector} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
// @ts-ignore
import * as nanoid from 'nanoid';
import {ModuleDefinitions} from '../../../shared/interfaces/module.interface';
import {FieldComponent} from '../components/field/field.component';
import {COMPONENT_TYPE_COMPONENT_MAP} from '../consts/component-type-component-map.const';
import {SchemaType} from '../enums/schema-type.enum';
import {CompiledField} from '../interfaces/compiled-field.interface';
import {SchemaValidators} from '../validators/schema-validators.class';
import {createComponentInjector} from './create-component-injector';
import {schemaToComponent} from './schema-to-component';

export interface PropertyDefinition {
  type: SchemaType;
  description?: string;
  default?: any;
}

export interface StringPropertyDefinition extends PropertyDefinition {
  type: SchemaType.String;
  default?: string;

  pattern?: string;
  minLength?: number;
  maxLength?: number;
}

export interface NumberPropertyDefinition extends PropertyDefinition {
  type: SchemaType.Number | SchemaType.Integer;
  default?: number;

  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
}

export interface BooleanPropertyDefinition extends PropertyDefinition {
  type: SchemaType.Boolean;
  default?: boolean;
}

export class Parser {
  constructor(public schema: any, public injector: Injector) {}

  form: FormGroup;
  pointers: {
    [pointer: string]: {
      key: string;
      type: SchemaType;
      control: FormControl;
    };
  } = {};

  static stringControl(
    definition: StringPropertyDefinition,
    required: boolean
  ) {
    const validation = [];

    if (required) {
      validation.push(Validators.required);
    }

    if (definition.maxLength) {
      validation.push(Validators.maxLength(definition.maxLength));
    }

    if (definition.minLength) {
      validation.push(Validators.minLength(definition.minLength));
    }

    if (definition.pattern) {
      validation.push(Validators.pattern(definition.pattern));
    }

    return new FormControl(definition.default || '', validation);
  }

  static numberControl(
    definition: NumberPropertyDefinition,
    required: boolean
  ) {
    const validation = [];

    if (required) {
      validation.push(Validators.required);
    }

    if (definition.minimum) {
      validation.push(
        Validators.min(
          definition.minimum + (definition.exclusiveMinimum ? 1 : 0)
        )
      );
    }

    if (definition.maximum) {
      validation.push(
        Validators.max(
          definition.maximum - (definition.exclusiveMaximum ? 1 : 0)
        )
      );
    }

    if (definition.multipleOf) {
      validation.push(SchemaValidators.multipleOf(definition.multipleOf));
    }

    return new FormControl(definition.default || null, validation);
  }

  static booleanControl(
    definition: BooleanPropertyDefinition,
    required: boolean
  ) {
    const validation = [];

    if (required) {
      validation.push(Validators.required);
    }

    return new FormControl(definition.default || false, validation);
  }

  buildForm(value?: any) {
    this.form = this.buildProperties(this.schema.properties || {});
    this.form.addControl('id', new FormControl(value ? value.id : nanoid()));

    if (value) {
      this.form.patchValue(value);
    }

    return this.form;
  }

  buildProperties(properties: object, required: string[] = [], base = '/') {
    return new FormGroup(
      Object.entries(properties).reduce((group, [key, value]) => {
        const isRequired = required.includes(key);

        switch (value.type) {
          case SchemaType.String:
            group[key] = Parser.stringControl(value, isRequired);

            break;

          case SchemaType.Number:
          case SchemaType.Integer:
            group[key] = Parser.numberControl(value, isRequired);

            break;

          case SchemaType.Boolean:
            group[key] = Parser.booleanControl(value, isRequired);

            break;

          case SchemaType.Object:
            group[key] = this.buildProperties(
              value.properties,
              value.required,
              base + key + '/'
            );

            break;

          case SchemaType.Array:
            group[key] = new FormArray([]);

            break;
        }

        if (base) {
          this.pointers[base + key] = {
            key,
            type: value.type,
            control: group[key]
          };
        }

        return group;
      }, {})
    );
  }

  field(pointer: string, definitions: ModuleDefinitions = {}): CompiledField {
    const {key, type, control} = this.pointers[pointer];
    const definition = {
      label: key,
      ...definitions[pointer]
    };

    if (!definition.component) {
      definition.component = schemaToComponent(type);
    }

    const portal = new ComponentPortal<FieldComponent<any>>(
      COMPONENT_TYPE_COMPONENT_MAP[definition.component.type],
      null,
      createComponentInjector(this.injector, {
        control,
        ...definition,
        ...(definition.component.configuration || {})
      })
    );

    return {
      pointer,
      control,
      portal,
      label: definition.label
    };
  }
}
