import {ComponentPortal} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {defer, from, Observable, of} from 'rxjs';
import {map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {ViewState} from '../../../../shared/enums/view-state.enum';
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
    private router: Router,
    private afs: AngularFirestore,
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
    this.data$ = this.moduleInstance.module$.pipe(
      switchMap(module =>
        this.activatedRoute.params.pipe(
          switchMap(params => {
            if (params.id === 'new') {
              this.currentState = ViewState.New;
              return of(null);
            } else if (params.id.endsWith('--copy')) {
              this.currentState = ViewState.Copy;
              const id = params.id.replace('--copy', '');
              return this.afs
                .collection(module.id)
                .doc(id)
                .valueChanges()
                .pipe(
                  take(1),
                  map(value => ({
                    ...value,
                    id
                  })),
                  queue()
                );
            } else {
              this.currentState = ViewState.Edit;
              return this.afs
                .collection(module.id)
                .doc(params.id)
                .valueChanges()
                .pipe(
                  take(1),
                  map(value => ({
                    ...value,
                    id: params.id
                  })),
                  queue()
                );
            }
          }),
          map((value: Partial<Module>) => {
            const parser = new Parser(module.schema, this.injector);
            const form = parser.buildForm(value);

            console.log('parser', parser);
            console.log('form', form);

            form.valueChanges.subscribe(change => {
              console.log('form', form);
            });

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
                  this.injector
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
    return defer(() => {
      const {id, ...data} = instance.form.getRawValue();

      return from(
        this.afs
          .collection(instance.module.id)
          .doc(id)
          .set(data, {merge: true})
      ).pipe(
        notify(),
        tap(() => this.back(instance))
      );
    });
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
