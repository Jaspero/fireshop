import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Definitions, FormBuilderComponent, safeEval, Segment, State} from '@jaspero/form-builder';
import {JSONSchema7} from 'json-schema';
import {Observable, of} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {ViewState} from '../../../../../../shared/enums/view-state.enum';
import {ModuleAuthorization} from '../../../../../../shared/interfaces/module-authorization.interface';
import {Module} from '../../../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {notify} from '../../../../../../shared/utils/notify.operator';
import {queue} from '../../../../../../shared/utils/queue.operator';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';

interface Instance {
  module: {
    id: string;
    name: string;
    editTitleKey: string;
  };
  directLink: boolean;
  formatOnSave: (data: any) => any;
  formatOnEdit: (data: any) => any;
  formatOnCreate: (data: any) => any;
  authorization?: ModuleAuthorization;
  formBuilder: {
    schema: JSONSchema7;
    definitions: Definitions;
    value: any;
    segments?: Segment[];
  }
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
    private ioc: InstanceOverviewContextService
  ) {}

  @ViewChild(FormBuilderComponent, {static: false})
  formBuilderComponent: FormBuilderComponent;

  initialValue: string;
  currentValue: string;
  viewState = ViewState;
  currentState: ViewState;
  formState: State;

  data$: Observable<Instance>;

  ngOnInit() {
    this.data$ = this.ioc.module$.pipe(
      switchMap(module =>
        this.activatedRoute.params.pipe(
          switchMap(params => {
            if (params.id === 'new') {
              this.currentState = ViewState.New;
              this.formState = State.Create;
              return of(null);
            } else if (params.id.endsWith('--copy')) {
              this.currentState = ViewState.Copy;
              this.formState = State.Create;
              return this.dbService
                .getDocument(module.id, params.id.replace('--copy', ''))
                .pipe(queue());
            } else {
              this.currentState = ViewState.Edit;
              this.formState = State.Edit;
              return this.dbService
                .getDocument(module.id, params.id)
                .pipe(queue());
            }
          }),
          map((value: Partial<Module>) => {
            this.initialValue = JSON.stringify(value);
            this.currentValue = JSON.stringify(this.initialValue);

            let editTitleKey = 'id';

            const formatOn: any = {};

            if (module.layout) {
              if (module.layout.editTitleKey) {
                editTitleKey = module.layout.editTitleKey;
              }

              if (module.layout.instance) {
                if (module.layout.instance.formatOnLoad) {
                  const method = safeEval(module.layout.instance.formatOnLoad);

                  if (method) {
                    value = method(value);
                  }
                }

                ['formatOnSave', 'formatOnEdit', 'formatOnCreate'].forEach(it => {
                  if (module.layout.instance[it]) {
                    const method = safeEval(module.layout.instance[it]);

                    if (method) {
                      formatOn[it] = method;
                    }
                  }
                });
              }
            }

            return {
              module: {
                id: module.id,
                name: module.name,
                editTitleKey
              },
              directLink: !!(module.layout && module.layout.directLink),
              authorization: module.authorization,
              ...formatOn,
              formBuilder: {
                schema: module.schema,
                definitions: module.definitions,
                value,
                ...module.layout && module.layout.instance && module.layout.instance.segments && {
                  segments: module.layout.instance.segments
                }
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
      this.formBuilderComponent.process();
      const id = this.formBuilderComponent.form.getRawValue().id || this.dbService.createId();

      return this.formBuilderComponent.save(
        instance.module.id,
        id
      ).pipe(
        switchMap(() => {
          let data = this.formBuilderComponent.form.getRawValue();

          if (this.currentState === ViewState.Edit && instance.formatOnEdit) {
            data = instance.formatOnEdit(data);
          } else if (this.currentState === ViewState.New && instance.formatOnCreate) {
            data = instance.formatOnCreate(data);
          }

          if (instance.formatOnSave) {
            data = instance.formatOnSave(data);
          }

          delete data.id;

          return this.dbService.setDocument(instance.module.id, id, data);
        }),
        notify(),
        tap(() => {
          if (!instance.directLink) {
            this.back();
          }
        })
      );
    };
  }

  back() {
    this.initialValue = '';
    this.currentValue = '';
    this.router.navigate(['../..', 'overview'], {relativeTo: this.activatedRoute});
  }
}
