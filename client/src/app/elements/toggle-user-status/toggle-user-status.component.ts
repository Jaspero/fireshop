import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
import {FormControl} from '@angular/forms';
import {RxDestroy} from '@jaspero/ng-helpers';
import {from} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {queue} from '../../shared/utils/queue.operator';

@Component({
  selector: 'jms-toggle-user-status',
  templateUrl: './toggle-user-status.component.html',
  styleUrls: ['./toggle-user-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleUserStatusComponent extends RxDestroy implements OnInit {
  constructor(
    private aff: AngularFireFunctions,
    private cdr: ChangeDetectorRef,
    private el: ElementRef
  ) {
    super();
  }

  status: FormControl;
  loading = true;

  ngOnInit() {
    const {id} = this.el.nativeElement.dataset;
    this.aff.functions.httpsCallable('cms-getUser')(id)
      .then((user: any) => {
        this.status = new FormControl(user.disabled);
        this.loading = false;

        this.status.valueChanges
          .pipe(
            switchMap(disabled =>
              from(
                this.aff.functions.httpsCallable('cms-updateUser')({
                  id,
                  disabled
                })
              )
                .pipe(
                  queue()
                )
            ),
            takeUntil(this.destroyed$)
          )
          .subscribe();

        this.cdr.markForCheck();
      })
      .catch(error => {
        this.status = new FormControl(false);
        this.loading = false;
        this.cdr.markForCheck();
        console.error(error);
      })
  }

  dummy(event) {
    event.stopPropagation();
  }
}
