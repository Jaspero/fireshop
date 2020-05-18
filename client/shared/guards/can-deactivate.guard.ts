import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {ConfirmationComponent} from '@jf/components/confirmation/confirmation.component';
import {map} from 'rxjs/operators';
import {of} from 'rxjs';
import {Color} from '../../apps/shop/src/app/shared/enums/color.enum';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {
  constructor(private _dialog: MatDialog) {}

  canDeactivate(component: any) {
    if (
      this.shallowEqual(
        component ? component.initialValue : '',
        component ? component.currentValue : ''
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
            color: Color.Primary
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
