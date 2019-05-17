import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {notify} from '@jf/utils/notify.operator';
import * as nanoid from 'nanoid';
import {defer, from, Observable, of} from 'rxjs';
import {map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {Role} from '../../enums/role.enum';
import {StateService} from '../../services/state/state.service';
import {queue} from '../../utils/queue.operator';

export enum ViewState {
  New,
  Edit,
  Copy
}

@Component({
  selector: 'jfsc-single-page',
  template: ''
})
export class SinglePageComponent extends RxDestroy implements OnInit {
  constructor(
    public router: Router,
    public afs: AngularFirestore,
    public state: StateService,
    public activatedRoute: ActivatedRoute,
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder
  ) {
    super();
  }

  initialValue: any;
  currentValue: any;
  collection: FirestoreCollections;
  form: FormGroup;
  viewState = ViewState;
  currentState: ViewState;

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params.id === 'new') {
            this.currentState = ViewState.New;
            return of({});
          } else if (params.id.includes('copy')) {
            this.currentState = ViewState.Copy;
            return this.afs
              .collection(this.collection)
              .doc(this.form.controls.id.value)
              .valueChanges()
              .pipe(
                take(1),
                map(value => ({
                  ...value,
                  id: params.id
                })),
                queue()
              );
          } else {
            this.currentState = ViewState.Edit;
            return this.afs
              .collection(this.collection)
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
        takeUntil(this.destroyed$)
      )
      .subscribe(data => {
        this.buildForm(data);

        if (this.state.role === Role.Read) {
          this.form.disable();
        } else {
          this.initialValue = this.form.getRawValue();
          this.currentValue = this.form.getRawValue();

          this.form.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe(value => {
              this.currentValue = value;
            });
        }

        this.cdr.detectChanges();
      });
  }

  save() {
    /**
     * TODO(Filip): clean this up
     */
    return defer(() => {
      const {id, ...item} = this.form.getRawValue();
      this.initialValue = this.form.getRawValue();

      return this.getSaveData(id, item).pipe(
        notify(),
        tap(() => {
          this.back();
        })
      );
    });
  }

  buildForm(data: any) {}

  createId(): string {
    return nanoid();
  }

  getSaveData(...args): Observable<any> {
    return defer(() => {
      const [id, item] = args;

      return from(
        this.afs
          .collection(this.collection)
          .doc(id || this.createId())
          .set(
            {
              ...item,
              ...(this.currentState === this.viewState.Edit
                ? {}
                : {createdOn: Date.now()})
            },
            {merge: true}
          )
      );
    });
  }

  back() {
    this.initialValue = '';
    this.currentValue = '';
    this.router.navigate(['/', this.collection]);
  }

  duplicate(form) {
    this.router.navigate([
      this.collection + '/copy' + '_' + form.controls.id.value
    ]);
  }
}
