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
import {Control} from '../interfaces/control.type';
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

export interface ArrayPropertyDefinition extends PropertyDefinition {
  type: SchemaType.Array;
  items?: any;
  contains?: any;
}

export interface Pointer {
  key: string;
  type: SchemaType;
  control: Control;
  validation: any;

  /**
   * Arrays can have these properties
   */
  arrayType?: SchemaType;
  properties?: any;
  required?: string[];
  arrayPointers?: Pointers[];
}

export interface Pointers {
  [key: string]: Pointer;
}

export class Parser {
  constructor(public schema: any, public injector: Injector) {}

  form: FormGroup;
  pointers: Pointers = {};

  static stringControl(
    definition: StringPropertyDefinition,
    required: boolean
  ) {
    const controlValidation = [];
    const validation: any = {};

    if (required) {
      controlValidation.push(Validators.required);
      validation.required = true;
    }

    if (definition.maxLength) {
      controlValidation.push(Validators.maxLength(definition.maxLength));
      validation.maxLength = definition.maxLength;
    }

    if (definition.minLength) {
      controlValidation.push(Validators.minLength(definition.minLength));
      validation.minLength = definition.minLength;
    }

    if (definition.pattern) {
      controlValidation.push(Validators.pattern(definition.pattern));
      validation.patter = definition.pattern;
    }

    return {
      control: new FormControl(definition.default || '', controlValidation),
      validation
    };
  }

  static numberControl(
    definition: NumberPropertyDefinition,
    required: boolean
  ) {
    const validation: any = {};
    const controlValidation = [];

    if (required) {
      controlValidation.push(Validators.required);
      validation.required = true;
    }

    if (definition.minimum) {
      const minimum =
        definition.minimum + (definition.exclusiveMinimum ? 1 : 0);
      controlValidation.push(Validators.min(minimum));
      validation.minimum = minimum;
    }

    if (definition.maximum) {
      const maximum =
        definition.maximum - (definition.exclusiveMaximum ? 1 : 0);
      controlValidation.push(Validators.max(maximum));
      validation.maximum = maximum;
    }

    if (definition.multipleOf) {
      controlValidation.push(
        SchemaValidators.multipleOf(definition.multipleOf)
      );
      validation.multipleOf = definition.multipleOf;
    }

    return {
      control: new FormControl(definition.default || null, controlValidation),
      validation
    };
  }

  static booleanControl(
    definition: BooleanPropertyDefinition,
    required: boolean
  ) {
    const controlValidation = [];
    const validation: any = {};

    if (required) {
      controlValidation.push(Validators.required);
      validation.required = true;
    }

    return {
      control: new FormControl(definition.default || false, controlValidation),
      validation
    };
  }

  buildForm(value?: any) {
    const properties = this.buildProperties(this.schema.properties || {});

    this.form = properties.form;
    this.pointers = properties.pointers;
    this.form.addControl('id', new FormControl(value ? value.id : nanoid()));

    if (value) {
      this.form.patchValue(value);
    }

    return this.form;
  }

  buildProperties(properties: object, required: string[] = [], base = '/') {
    const {form, pointers} = Object.entries(properties).reduce(
      (group, [key, value]) => {
        const isRequired = required.includes(key);

        let parsed: {
          control: any;
          validation: any;
          arrayType?: SchemaType;
          properties?: any;
          required?: string[];
        };

        switch (value.type) {
          case SchemaType.String:
            parsed = Parser.stringControl(value, isRequired);
            break;

          case SchemaType.Number:
          case SchemaType.Integer:
            parsed = Parser.numberControl(value, isRequired);
            break;

          case SchemaType.Boolean:
            parsed = Parser.booleanControl(value, isRequired);
            break;

          case SchemaType.Object:
            const objectProperties = this.buildProperties(
              value.properties,
              value.required,
              base + key + '/'
            );

            for (const added in objectProperties.pointers) {
              if (objectProperties.pointers.hasOwnProperty(added)) {
                group.pointers[added] = objectProperties.pointers[added];
              }
            }

            parsed = {
              control: objectProperties.form,
              validation: {}
            };
            break;

          case SchemaType.Array:
            parsed = this.buildArray(base, value);
            break;
        }

        group.form[key] = parsed.control;
        group.pointers[base + key] = {
          key,
          type: value.type,
          ...parsed
        };

        return group;
      },
      {
        form: {},
        pointers: {}
      }
    );

    return {
      pointers,
      form: new FormGroup(form)
    };
  }

  field(
    pointerKey: string,
    pointer: Pointer,
    definitions: ModuleDefinitions = {}
  ): CompiledField {
    const {key, type, control, validation} = pointer;
    // console.log(definitions, key);
    const definition = {
      label: key,
      ...definitions[key]
    };

    // console.log(definition.component);

    if (!definition.component) {
      definition.component = schemaToComponent(type);
    }

    const portal = new ComponentPortal<FieldComponent<any>>(
      COMPONENT_TYPE_COMPONENT_MAP[definition.component.type],
      null,
      createComponentInjector(this.injector, {
        control,
        validation,
        ...definition,
        ...(definition.component.configuration || {})
      })
    );

    return {
      pointer: pointerKey,
      control,
      portal,
      validation,
      label: definition.label
    };
  }

  addArrayItem(pointer: string) {
    const target = this.pointers[pointer];
    const control = this.pointers[pointer].control as FormArray;

    if (
      target.arrayType === SchemaType.Array ||
      target.arrayType === SchemaType.Object
    ) {
      const properties = this.buildProperties(
        target.properties,
        target.required,
        ''
      );

      target.arrayPointers.push(properties.pointers);
      control.push(properties.form);
    } else {
      // TODO: Different SchemaType
      control.push(new FormControl(''));
    }
  }

  removeArrayItem(pointer: string, index: number) {
    this.pointers[pointer].arrayPointers.splice(index, 1);
    (this.pointers[pointer].control as FormArray).removeAt(index);
  }

  /**
   * TODO:
   * - Handle contains case
   * - Handle items or contains as array not object
   */
  private buildArray(base: string, definition: ArrayPropertyDefinition) {
    if (
      !definition.items ||
      (definition.items.type !== SchemaType.Array &&
        definition.items.type !== SchemaType.Object)
    ) {
      return {
        control: new FormControl([]),
        ...(definition.items
          ? {
              arrayType: definition.items.type,
              properties: definition.items.properties,
              required: definition.items.required,
              validation: {}
            }
          : {
              arrayType: SchemaType.String,
              validation: {}
            })
      };
    } else {
      return {
        arrayType: definition.items.type,
        properties: definition.items.properties,
        required: definition.items.required,
        validation: {},
        control: new FormArray([]),
        arrayPointers: []
      };
    }
  }
}
