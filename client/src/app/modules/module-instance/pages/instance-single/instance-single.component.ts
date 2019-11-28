import {ChangeDetectionStrategy, Component, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
// @ts-ignore
import * as nanoid from 'nanoid';
import {forkJoin, Observable, of} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {ViewState} from '../../../../shared/enums/view-state.enum';
import {ModuleInstanceSegment} from '../../../../shared/interfaces/module-instance-segment.interface';
import {Module} from '../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {notify} from '../../../../shared/utils/notify.operator';
import {queue} from '../../../../shared/utils/queue.operator';
import {InstanceSingleState} from '../../enums/instance-single-state.enum';
import {ModuleInstanceComponent} from '../../module-instance.component';
import {filterAndCompileSegments} from '../../utils/filter-and-compile-segments';
import {Parser} from '../../utils/parser';
import {CompiledSegment} from '../../../../shared/interfaces/compiled-segment.interface';


interface Instance {
  form: FormGroup;
  module: {
    id: string;
    name: string;
    editTitleKey: string;
  };
  parser: Parser;
  segments: CompiledSegment[];
  directLink: boolean;
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

            parser.loadHooks();

            this.initialValue = JSON.stringify(form.getRawValue());
            this.currentValue = JSON.stringify(this.initialValue);

            let editTitleKey = 'id';
            let segments: ModuleInstanceSegment[];

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
              segments: filterAndCompileSegments(
                this.state.role,
                segments,
                parser,
                module.definitions,
                this.injector,
                value
              ),
              module: {
                id: module.id,
                name: module.name,
                editTitleKey
              },
              directLink: !!(module.layout && module.layout.directLink)
            };
          })
        )
      ),
      shareReplay(1)
    );
  }

  save(instance: Instance) {
    return () => {
      let data = instance.form.getRawValue();

      const id = data.id || nanoid();
      const toExecute = [];

      if (this.state.saveComponents) {
        toExecute.push(...this.state.saveComponents.map(comp =>
          comp.save(instance.module.id, id)
        ));
      }

      instance.parser.preSaveHooks(this.currentState);

      return (toExecute.length ? forkJoin(toExecute) : of([])).pipe(
        switchMap(() => {
          data = instance.form.getRawValue();

          delete data.id;

          return this.dbService.setDocument(instance.module.id, id, data);
        }),
        notify(),
        tap(() => {
          if (!instance.directLink) {
            this.back(instance);
          }
        })
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
