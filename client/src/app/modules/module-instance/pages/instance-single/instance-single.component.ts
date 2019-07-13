import {ComponentPortal} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
// @ts-ignore
import * as nanoid from 'nanoid';
import {forkJoin, Observable, of} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {ViewState} from '../../../../shared/enums/view-state.enum';
import {
  InstanceSegment,
  Module
} from '../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {notify} from '../../../../shared/utils/notify.operator';
import {queue} from '../../../../shared/utils/queue.operator';
import {SegmentComponent} from '../../components/segment/segment.component';
import {InstanceSingleState} from '../../enums/instance-single-state.enum';
import {CompiledField} from '../../interfaces/compiled-field.interface';
import {ModuleInstanceComponent} from '../../module-instance.component';
import {compileSegment} from '../../utils/compile-segment';
import {Parser} from '../../utils/parser';

export interface CompiledSegment extends InstanceSegment {
  classes: string[];
  fields: CompiledField[];
  component?: ComponentPortal<SegmentComponent>;
  nestedSegments?: CompiledSegment[];
  entryValue: any;
}

interface Instance {
  form: FormGroup;
  module: {
    id: string;
    name: string;
    editTitleKey: string;
  };
  parser: Parser;
  segments: CompiledSegment[];
}

@Component({
  selector: 'jms-instance-single',
  templateUrl: './instance-single.component.html',
  styleUrls: ['./instance-single.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceSingleComponent implements OnInit {
  constructor(
    private dbService: DbService,
    private router: Router,
    private state: StateService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private moduleInstance: ModuleInstanceComponent,
    private injector: Injector
  ) {}

  initialValue: string;
  currentValue: string;
  viewState = ViewState;
  currentState: ViewState;

  data$: Observable<Instance>;

  ngOnInit() {
    this.state.saveComponents = [];

    this.data$ = this.moduleInstance.module$.pipe(
      switchMap(module =>
        this.activatedRoute.params.pipe(
          switchMap(params => {
            if (params.id === 'new') {
              this.currentState = ViewState.New;
              return of(null);
            } else if (params.id.endsWith('--copy')) {
              this.currentState = ViewState.Copy;
              return this.dbService
                .getDocument(module.id, params.id.replace('--copy', ''))
                .pipe(queue());
            } else {
              this.currentState = ViewState.Edit;
              return this.dbService
                .getDocument(module.id, params.id)
                .pipe(queue());
            }
          }),
          map((value: Partial<Module>) => {
            const parser = new Parser(
              module.schema,
              this.injector,
              this.currentState === ViewState.Edit
                ? InstanceSingleState.Edit
                : InstanceSingleState.Create,
              module.definitions
            );
            const form = parser.buildForm(value);

            console.log('parser', parser);
            console.log('form', form);

            Object.values(parser.pointers).forEach(entry => {
              /**
               * TODO:
               * For the moment formatOn methods are
               * only supported on FormControls.
               * We might want to expand on this later on.
               */
              if (entry.control instanceof FormControl && entry.formatOnLoad) {
                const adjustedValue = entry.formatOnLoad(entry.control.value);

                if (adjustedValue !== entry.control.value) {
                  entry.control.setValue(adjustedValue);
                }
              }
            });

            this.initialValue = JSON.stringify(form.getRawValue());
            this.currentValue = JSON.stringify(this.initialValue);

            let editTitleKey = 'id';
            let segments: InstanceSegment[];

            if (
              module.layout &&
              module.layout.instance &&
              module.layout.instance.segments
            ) {
              segments = module.layout.instance.segments;
            } else {
              segments = [
                {
                  title: '',
                  fields: Object.keys(parser.pointers),
                  columnsDesktop: 12
                }
              ];
            }

            if (module.layout && module.layout.editTitleKey) {
              editTitleKey = module.layout.editTitleKey;
            }

            return {
              form,
              parser,
              segments: segments.map(segment =>
                compileSegment(
                  segment,
                  parser,
                  module.definitions,
                  this.injector,
                  value
                )
              ),
              module: {
                id: module.id,
                name: module.name,
                editTitleKey
              }
            };
          })
        )
      ),
      shareReplay(1)
    );
  }

  save(instance: Instance) {
    return () => {
      const preSaveData = instance.form.getRawValue();
      const toExecute = [];

      if (this.state.saveComponents) {
        toExecute.push(...this.state.saveComponents.map(comp => comp.save()));
      }

      Object.values(instance.parser.pointers).forEach(entry => {
        /**
         * TODO:
         * For the moment formatOn methods are
         * only supported on FormControls.
         * We might want to expand on this later on.
         */
        if (entry.control instanceof FormControl) {
          let value = entry.control.value;

          if (entry.formatOnSave) {
            value = entry.formatOnSave(value, preSaveData);
          }

          if (this.currentState === ViewState.Edit && entry.formatOnEdit) {
            value = entry.formatOnEdit(value, preSaveData);
          } else if (entry.formatOnCreate) {
            value = entry.formatOnCreate(value, preSaveData);
          }

          if (value !== entry.control.value) {
            entry.control.setValue(value);
          }
        }
      });

      return (toExecute.length ? forkJoin(toExecute) : of([])).pipe(
        switchMap(() => {
          const {id, ...data} = instance.form.getRawValue();

          return this.dbService.setDocument(
            instance.module.id,
            id || nanoid(),
            data
          );
        }),
        notify(),
        tap(() => this.back(instance))
      );
    };
  }

  back(instance: Instance) {
    this.initialValue = '';
    this.currentValue = '';
    this.router.navigate(['/m', instance.module.id, 'overview']);
  }

  duplicate(instance: Instance) {
    this.router.navigate([
      '/m',
      instance.module.id,
      'single',
      `${instance.form.get('id').value}--copy`
    ]);
  }

  move(forward: boolean, form: FormGroup) {}
}
