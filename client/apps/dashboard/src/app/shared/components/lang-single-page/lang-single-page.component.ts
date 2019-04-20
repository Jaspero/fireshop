import {Component, OnInit} from '@angular/core';
import {notify} from '@jf/utils/notify.operator';
import {combineLatest, from, of} from 'rxjs';
import {finalize, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {queue} from '../../utils/queue.operator';
import {SinglePageComponent} from '../single-page/single-page.component';

@Component({
  selector: 'jfsc-lang-single-page',
  template: ''
})
export class LangSinglePageComponent extends SinglePageComponent
  implements OnInit {
  ngOnInit() {
    combineLatest(this.activatedRoute.params, this.state.language$)
      .pipe(
        switchMap(([params, lang]) => {
          if (params.id === 'new') {
            this.isEdit = '';
            return of({});
          } else {
            this.isEdit = params.id;
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
      .subscribe(data => {
        this.buildForm(data);
        this.cdr.detectChanges();
      });
  }

  save() {
    this.loading$.next(true);

    const {id, ...item} = this.form.getRawValue();

    this.state.language$
      .pipe(
        take(1),
        switchMap(lang => this.getSaveData(id, item, lang)),
        finalize(() => this.loading$.next(false)),
        notify()
      )
      .subscribe(() => {
        this.back();
      });
  }

  getSaveData(...args) {
    const [id, item, lang] = args;

    return from(
      this.afs
        .collection(`${this.collection}-${lang}`)
        .doc(id || this.createId())
        .set(
          {
            item,
            ...(this.isEdit ? {} : {createdOn: Date.now()})
          },
          {merge: true}
        )
    );
  }

  buildForm(data: any) {}
}
