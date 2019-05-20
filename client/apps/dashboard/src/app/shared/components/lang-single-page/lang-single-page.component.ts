import {Component, OnInit} from '@angular/core';
import {notify} from '@jf/utils/notify.operator';
import {combineLatest, defer, from, of} from 'rxjs';
import {map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {Role} from '../../enums/role.enum';
import {queue} from '../../utils/queue.operator';
import {
  SinglePageComponent,
  ViewState
} from '../single-page/single-page.component';

@Component({
  selector: 'jfsc-lang-single-page',
  template: ''
})
export class LangSinglePageComponent extends SinglePageComponent
  implements OnInit {
  ngOnInit() {
    combineLatest([this.activatedRoute.params, this.state.language$])
      .pipe(
        switchMap(([params, lang]) => {
          if (params.id === 'new') {
            this.currentState = ViewState.New;
            return of({});
          } else if (params.id.includes('copy')) {
            this.currentState = ViewState.Copy;
            return this.afs
              .collection(`${this.collection}-${lang}`)
              .doc(this.form.controls.id.value)
              .valueChanges()
              .pipe(
                take(1),
                map(value => ({
                  ...value
                })),
                queue()
              );
          } else {
            this.currentState = ViewState.Edit;
            return this.afs
              .collection(`${this.collection}-${lang}`)
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
      .subscribe((data: any) => {
        this.buildForm(data);
        this.createdOn = data.createdOn || Date.now();

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
    return () => {
      const {id, ...item} = this.form.getRawValue();
      this.initialValue = this.form.getRawValue();
      return this.state.language$.pipe(
        take(1),
        switchMap(lang => this.getSaveData(id, item, lang)),
        notify(),
        tap(() => {
          this.back();
        })
      );
    };
  }

  getSaveData(...args) {
    const [id, item, lang] = args;

    return from(
      this.afs
        .collection(`${this.collection}-${lang}`)
        .doc(id || this.createId())
        .set({
          ...item,
          createdOn: this.createdOn
        })
    );
  }

  buildForm(data: any) {}
}
