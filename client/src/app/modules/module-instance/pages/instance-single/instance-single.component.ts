import {ComponentPortal} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnInit
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {DB_SERVICE} from '../../../../app.module';
import {ViewState} from '../../../../shared/enums/view-state.enum';
import {DbService} from '../../../../shared/interfaces/db-service.interface';
import {
  InstanceSegment,
  Module
} from '../../../../shared/interfaces/module.interface';
import {StateService} from '../../../../shared/services/state/state.service';
import {notify} from '../../../../shared/utils/notify.operator';
import {queue} from '../../../../shared/utils/queue.operator';
import {SegmentComponent} from '../../components/segment/segment.component';
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
  };
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
    @Inject(DB_SERVICE)
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
    this.state.uploadComponents = [];

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
                .getCollectionDocument(
                  module.id,
                  params.id.replace('--copy', '')
                )
                .pipe(queue());
            } else {
              this.currentState = ViewState.Edit;
              return this.dbService
                .getCollectionDocument(module.id, params.id)
                .pipe(queue());
            }
          }),
          map((value: Partial<Module>) => {
            const parser = new Parser(module.schema, this.injector);
            const form = parser.buildForm(value);

            console.log('parser', parser);
            console.log('form', form);

            this.initialValue = JSON.stringify(form.getRawValue());
            this.currentValue = JSON.stringify(this.initialValue);

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

            return {
              form,
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
                name: module.name
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
      const toExecute = [];

      if (this.state.uploadComponents) {
        toExecute.push(...this.state.uploadComponents.map(comp => comp.save()));
      }

      return (toExecute.length ? forkJoin(toExecute) : of([])).pipe(
        switchMap(() => {
          const {id, ...data} = instance.form.getRawValue();

          return this.dbService.setCollection(instance.module.id, id, data);
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
