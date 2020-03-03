import {ConfirmationOptions} from '../components/confirmation/confirmation-options.interface';
import {ConfirmationComponent} from '../components/confirmation/confirmation.component';
import {filter} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';

export function confirmation(
  pipes,
  options: Partial<ConfirmationOptions> = {}
) {
  const dialog: MatDialog = window['rootInjector'].get(MatDialog);

  pipes = pipes || [];

  if (!options.skipFilter) {
    pipes.unshift(filter(val => !!val));
  }

  const dialogInstance =
    (dialog
      .open(ConfirmationComponent, {
        width: '400px',
        data: options
      })
      .afterClosed() as any)
      .pipe(...pipes);

  if (!options.skipSubscribe) {
    dialogInstance.subscribe();
  }

  return dialogInstance;
}
