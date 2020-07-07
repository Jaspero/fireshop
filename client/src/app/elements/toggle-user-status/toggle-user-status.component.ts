import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {DbService} from '../../shared/services/db/db.service';
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
    private el: ElementRef,
    private dbService: DbService
  ) {}

  status: FormControl;
  loading = true;

  ngOnInit() {
    const {id} = this.el.nativeElement.dataset;

    this.dbService.callFunction('cms-getUser', id)
      .pipe(
        catchError((error => {
          this.status = new FormControl(false);
          this.loading = false;
          this.cdr.markForCheck();
          console.error(error);
          return throwError(error);
        })),
        tap(user => {
          this.status = new FormControl(user.disabled);
          this.loading = false;
        }),
        switchMap(() => {
          return this.status.valueChanges
        }),
        switchMap(disabled => {
          return this.dbService.callFunction('cms-updateUser', {
            id,
            disabled
          })
        }),
        queue(),
        untilDestroyed(this)
      )
      .subscribe(() => this.cdr.markForCheck());
  }

  dummy(event) {
    event.stopPropagation();
  }
}
