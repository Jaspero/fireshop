import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
// @ts-ignore
import {Observable, of} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {ViewState} from '../../../../shared/enums/view-state.enum';
import {Module} from '../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {notify} from '../../../../shared/utils/notify.operator';
import {SchemaValidation} from '../../../../shared/utils/schema-validation';

@Component({
  selector: 'jms-definition-instance',
  templateUrl: './definition-instance.component.html',
  styleUrls: ['./definition-instance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionInstanceComponent implements OnInit {
  constructor(
    private dbService: DbService,
    private router: Router,
    private state: StateService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  initialValue: string;
  currentValue: string;
  viewState = ViewState;
  currentState: ViewState;
  schemaValidation: SchemaValidation;

  form$: Observable<FormGroup>;

  ngOnInit() {
    this.schemaValidation = new SchemaValidation();

    this.form$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        if (params.id === 'new') {
          this.currentState = ViewState.New;
          return of({});
        } else if (params.id.endsWith('--copy')) {
          this.currentState = ViewState.Copy;
          return this.state.modules$.pipe(
            map(modules =>
              modules.find(
                module => module.id === params.id.replace('--copy', '')
              )
            )
          );
        } else {
          this.currentState = ViewState.Edit;
          return this.state.modules$.pipe(
            map(modules => modules.find(module => module.id === params.id))
          );
        }
      }),
      map((value: Partial<Module>) => {
        const form = this.fb.group({
          id: {value: value.id, disabled: this.currentState === ViewState.Edit},
          createdOn:
            this.currentState === ViewState.Edit ? value.createdOn : Date.now(),
          name: [value.name || '', Validators.required],
          description: value.description || '',
          schema: value.schema || {},
          layout: value.layout || {},
          definitions: value.definitions || {}
        });

        this.initialValue = JSON.stringify(form.getRawValue());
        this.currentValue = JSON.stringify(this.initialValue);

        return form;
      }),
      shareReplay(1)
    );
  }

  save(form: FormGroup) {
    return () => {
      const {id, ...data} = form.getRawValue();

      const {error} = this.schemaValidation.validate(data);

      if (error) {
        this.snackBar.open(
          'Schema invalid. Check console for more information.',
          'Dismiss',
          {
            panelClass: 'snack-bar-error',
            duration: 5000
          }
        );

        console.error(error);

        return of({});
      }

      return this.dbService.setModule(data, id).pipe(
        notify(),
        tap(() => this.back())
      );
    };
  }

  back() {
    this.initialValue = '';
    this.currentValue = '';
    this.router.navigate(['/module-definition/overview']);
  }

  duplicate(form: FormGroup) {
    this.router.navigate([
      '/module-definition/single',
      `${form.get('id').value}--copy`
    ]);
  }

  move(forward: boolean, form: FormGroup) {}
}
