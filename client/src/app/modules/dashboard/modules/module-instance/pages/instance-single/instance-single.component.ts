import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Definitions, FormBuilderComponent, safeEval, Segment, State} from '@jaspero/form-builder';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {JSONSchema7} from 'json-schema';
import {interval, Observable, of, Subject, Subscription} from 'rxjs';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';
import {ViewState} from '../../../../../../shared/enums/view-state.enum';
import {ModuleAuthorization} from '../../../../../../shared/interfaces/module-authorization.interface';
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
  autoSave?: true;
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

@UntilDestroy()
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
  ) {
  }

  @ViewChild(FormBuilderComponent, {static: false})
  formBuilderComponent: FormBuilderComponent;

  initialValue: string;
  currentValue: string;
  viewState = ViewState;
  currentState: ViewState;
  formState: State;

  data$: Observable<Instance>;
  change: Instance;

  saveBuffer$ = new Subject<Instance>();
  first = true;

  private autoSaveListener: Subscription;

  ngOnInit() {
    this.data$ = this.ioc.module$.pipe(
      switchMap(module =>
        this.activatedRoute.params.pipe(
          switchMap(params => {
            if (params.id === 'new') {
              this.currentState = ViewState.New;
              this.formState = State.Create;
              return of(history.state?.data);
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
          map((value: any) => {
            this.initialValue = JSON.stringify(value);
            this.currentValue = JSON.stringify(this.initialValue);

            let editTitleKey = 'id';

            const formatOn: any = {};
            const autoSave = module.metadata?.hasOwnProperty('autoSave') && this.currentState === ViewState.Edit;

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

            if (this.autoSaveListener) {
              this.autoSaveListener.unsubscribe();
            }

            if (autoSave && module.metadata.autoSave) {
              this.autoSaveListener = interval(module.metadata.autoSave)
                .subscribe(() => {
                  if (this.change) {
                    this.saveBuffer$.next(this.change);
                    this.change = null;
                  }
                })
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
              },
              ...autoSave && {autoSave: true}
            };
          })
        )
      )
    );

    this.saveBuffer$
      .pipe(
        debounceTime(300),
        switchMap(instance =>
          this.save(instance, false)()
        ),
        untilDestroyed(this)
      )
      .subscribe()
  }

  save(instance: Instance, navigate = true) {
    return () => {
      this.formBuilderComponent.process();
      const id = this.formBuilderComponent.form.getRawValue().id || this.dbService.createId();

      const actions: any[] = [
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
        })
      ];

      if (navigate) {
        actions.push(notify());

        if (!instance.directLink) {
          actions.push(tap(() => this.back()))
        }
      }

      return (this.formBuilderComponent.save(
        instance.module.id,
        id
      ).pipe as any)(...actions)
    };
  }

  back() {
    this.initialValue = '';
    this.currentValue = '';
    this.router.navigate(['../..', 'overview'], {relativeTo: this.activatedRoute});
  }

  valueChange(data: any, instance: Instance) {
    if (instance.autoSave) {
      if (this.first) {
        this.first = false;
        return;
      }

      const newValue = JSON.stringify(data);

      if (newValue !== this.initialValue) {
        if (this.autoSaveListener) {
          this.change = instance;
        } else {
          this.saveBuffer$.next(instance)
        }
      }
    }
  }
}
