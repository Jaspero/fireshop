import {MatDialog} from '@angular/material';
import {ConfirmationOptions} from '../components/confirmation/confirmation-options.interface';
import {ConfirmationComponent} from '../components/confirmation/confirmation.component';
import {filter} from 'rxjs/operators';

export function confirmation(
  pipes,
  options: Partial<ConfirmationOptions> = {}
) {
  const dialog: MatDialog = window['rootInjector'].get(MatDialog);

  // @ts-ignore
  dialog
    .open(ConfirmationComponent, {
      width: '400px',
      data: options
    })
    .afterClosed()
    .pipe(
      filter(val => !!val),
      ...pipes
    )
    .subscribe();
}
