import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {functions} from 'firebase';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {queue} from '../../shared/utils/queue.operator';

@UntilDestroy()
@Component({
  selector: 'jms-toggle-user-status',
  templateUrl: './toggle-user-status.component.html',
  styleUrls: ['./toggle-user-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleUserStatusComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private el: ElementRef
  ) {}

  status: FormControl;
  loading = true;

  ngOnInit() {
    const {id} = this.el.nativeElement.dataset;
    functions().httpsCallable('cms-getUser')(id)
      .then((user: any) => {
        this.status = new FormControl(user.disabled);
        this.loading = false;

        this.status.valueChanges
          .pipe(
            switchMap(disabled =>
              from(
                functions().httpsCallable('cms-updateUser')({
                  id,
                  disabled
                })
              )
                .pipe(
                  queue()
                )
            ),
            untilDestroyed(this)
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
