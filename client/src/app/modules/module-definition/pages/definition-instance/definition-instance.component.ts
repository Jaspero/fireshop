import {ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, combineLatest, forkJoin, Observable, of} from 'rxjs';
import {filter, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {ViewState} from '../../../../shared/enums/view-state.enum';
import {ComponentType} from '../../../../shared/interfaces/component-type.enum';
import {Module} from '../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {notify} from '../../../../shared/utils/notify.operator';
import {SchemaValidation} from '../../../../shared/utils/schema-validation';
import {DEFINITION_AUTOCOMPLETE} from './consts/definition-autocomplete.const';
import {DEFINITION_TEMPLATES} from './consts/definition-templates.const';
import {LAYOUT_AUTOCOMPLETE} from './consts/layout-autocomplete.const';
import {LAYOUT_TEMPLATES} from './consts/layout-templates.const';
import {SCHEMA_AUTOCOMPLETE} from './consts/schema-autocomplete.const';
import {SCHEMA_TEMPLATES} from './consts/schema-templates.const';
import {ExampleType} from '../../../../shared/enums/example-type.enum';
import {queue} from '../../../../shared/utils/queue.operator';
import {MatDialog} from '@angular/material/dialog';
import {Example, Snippet} from '../../../../shared/interfaces/example.interface';
import {Role} from '../../../../shared/enums/role.enum';
import {SNIPPET_FORM_MAP} from '../../../module-instance/consts/snippet-form-map.const';
import {confirmation} from '../../../../shared/utils/confirmation';
import {Color} from '../../../../shared/enums/color.enum';

@Component({
  selector: 'jms-definition-instance',
  templateUrl: './definition-instance.component.html',
  styleUrls: ['./definition-instance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionInstanceComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private dbService: DbService,
    private router: Router,
    private state: StateService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild('modal', {static: true})
  modalTemplate: TemplateRef<any>;

  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;

  initialValue: string;
  currentValue: string;
  viewState = ViewState;
  currentState: ViewState;
  schemaValidation: SchemaValidation;

  // https://github.com/josdejong/jsoneditor/blob/develop/docs/api.md
  schemaOptions = {
    templates: SCHEMA_TEMPLATES,
    autocomplete: SCHEMA_AUTOCOMPLETE
  };
  layoutOptions = {
    templates: LAYOUT_TEMPLATES,
    autocomplete: LAYOUT_AUTOCOMPLETE
  };
  definitionsOptions = {
    templates: DEFINITION_TEMPLATES,
    autocomplete: DEFINITION_AUTOCOMPLETE
  };
  role = Role;
  snippetExamples$ = new Observable<Example[]>();
  form$: Observable<FormGroup>;
  data$: Observable<any>;
  snippetForm: FormGroup;
  import$ = new BehaviorSubject('');

  ngOnInit() {
    this.snippetExamples$ = this.dbService.getExamples(ExampleType.Snippets)
      .pipe(
        queue(),
        map(res => res.data),
        shareReplay(1)
      );

    this.schemaValidation = new SchemaValidation();

    this.form$ = combineLatest([
      this.activatedRoute.params,
      this.import$
    ]).pipe(
      switchMap(([params, jsonImport]) => {
        const example: Example = window.history.state.example;

        if (jsonImport) {
          return of(jsonImport);
        } else {
          if (example) {
            this.currentState = ViewState.New;
            return of(example);
          } else if (params.id === 'new') {
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
          definitions: value.definitions || {},
          metadata: value.metadata || {},
          authorization: this.fb.group({
            read: [(value.authorization && value.authorization.read) || []],
            write: [(value.authorization && value.authorization.write) || []],
          })
        });

        this.initialValue = JSON.stringify(form.getRawValue());
        this.currentValue = JSON.stringify(this.initialValue);

        return form;
      }),
      shareReplay(1)
    );

    this.snippetForm = this.fb.group({
      snippet: ['', Validators.required],
      name: ['', Validators.required],
      label: '',
      required: false
    });

    this.data$ = this.snippetForm
      .get('snippet')
      .valueChanges
      .pipe(
        map(res => SNIPPET_FORM_MAP[res])
      );
  }

  save(form: FormGroup) {
    return () => {
      const {id, ...data} = form.getRawValue();

      if (!data.authorization.write.length) {
        delete data.authorization.write;
      }

      if (!data.authorization.read.length) {
        delete data.authorization.read;
      }

      if (!Object.keys(data.authorization).length) {
        delete data.authorization;
      }

      if (!Object.keys(data.metadata).length) {
        delete data.metadata;
      }

      const {error, value} = this.schemaValidation.validate(data.schema);

      if (error) {
        this.snackBar.open(
          'Schema invalid. Check console for more information.',
          'Dismiss',
          {
            panelClass: 'snack-bar-error',
            duration: 5000
          }
        );

        console.warn(value);

        return of({});
      }

      return this.state.modules$.pipe(
        take(1),
        switchMap(modules => {
          if (!data.layout.hasOwnProperty('order')) {
            data.layout.order = modules.length;
          }

          return this.dbService.setModule(data, id);
        }),
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

  openSnippetSelection(form) {
    this.snippetForm.reset({
      snippet: ComponentType.Input
    });
    this.dialog.open(this.modalTemplate, {
      width: '600px'
    })
      .afterClosed()
      .pipe(
        filter(res => res),
        switchMap(data => {
          return forkJoin([
            of(data),
            this.snippetExamples$.pipe(take(1))
          ]);
        })
      )
      .subscribe(([data, res]) => {
        const snippetFormValue = this.snippetForm.getRawValue();
        const json = res.find(item => item.name === snippetFormValue.snippet).json;
        const oldValue = form.getRawValue();

        form.get('schema').setValue({
          ...oldValue.schema,
          properties: {
            ...(oldValue.schema.properties || {}),
            [snippetFormValue.name]: json.schema
          },
          required: snippetFormValue.required ?
            [...oldValue.schema.required || [], snippetFormValue.name] :
            oldValue.schema.required || []
        });

        const component: any = {};
        const configuation = {
          ...(json as Snippet).definition.value.component.configuration && {
            ...(json as Snippet).definition.value.component.configuration,
            ...(data.value ? data.value : {})
          }
        };

        if (Object.keys(configuration).length) {
          component.configuration = configuration;
        }

        form.get('definitions').setValue({
          ...oldValue.definitions,
          [snippetFormValue.name]: {
            ...Object.keys(component).length && {component},
            label: snippetFormValue.label || snippetFormValue.name
          }
        });
      });
  }

  openSelectFile() {
    confirmation([
      tap(() => {
        this.fileEl.nativeElement.click();
      })
    ], {
      description: `This action will override your current module setup.`,
      confirm: 'Import',
      color: Color.Primary
    });
  }

  selectFile(event) {
    if (event.target.files[0] && event.target.files[0].type === 'application/json') {
      const reader = new FileReader();
      reader.readAsText(event.target.files[0], 'UTF-8');
      reader.onload = (evt: any) => {
        try {
          this.import$.next(JSON.parse(evt.target.result));
        } catch (e) {}

      };
    }
  }
}
