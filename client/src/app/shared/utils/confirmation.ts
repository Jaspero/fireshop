import {MatDialog} from '@angular/material/dialog';
import {filter} from 'rxjs/operators';
import {ConfirmationOptions} from '../components/confirmation/confirmation-options.interface';
import {ConfirmationComponent} from '../components/confirmation/confirmation.component';

export function confirmation(
  pipes,
  options: Partial<ConfirmationOptions> = {}
) {
  const dialog: MatDialog = (window as any).rootInjector.get(MatDialog);

  (dialog
    .open(ConfirmationComponent, {
      width: '400px',
      data: options
    })
    .afterClosed()
    .pipe as any)(
      filter(val => !!val),
      ...pipes
    )
    .subscribe();
}
