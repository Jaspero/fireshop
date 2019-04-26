import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ConfirmationComponent} from '@jf/components/confirmation/confirmation.component';
import {map} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {
  constructor(private _dialog: MatDialog) {}
  initialKey = 'initialValue';
  currentKey = 'currentValue';

  canDeactivate(component: any) {
    if (
      this.shallowEqual(
        component ? component[this.initialKey] : '',
        component ? component[this.currentKey] : ''
      )
    ) {
      return of(true);
    } else {
      return this._dialog
        .open(ConfirmationComponent, {
          width: '400px',
          data: {
            title: 'You have unsaved changes',
            description:
              'You made changes on this page. What would you like to do with them before you leave?',
            confirm: 'Continue editing',
            negate: 'Discard changes',
            color: 'primary'
          }
        })
        .afterClosed()
        .pipe(
          map(res => {
            if (res === undefined) {
              return false;
            } else {
              return !res;
            }
          })
        );
    }
  }

  shallowEqual(first: Object, second: Object) {
    return JSON.stringify(first) === JSON.stringify(second);
  }
}
