import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslocoService} from '@ngneat/transloco';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

const DEFAULT_OPTIONS = {
  showThrownError: false,
  success: 'GENERAL.OPERATION_COMPLETED',
  error: 'GENERAL.OPERATION_FAILED'
};

export function notify(
  options: {
    showThrownError?: boolean;
    success?: string | boolean;
    error?: string | boolean;
  } = {}
): <T>(source$: Observable<T>) => Observable<T> {
  const finalOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const snackBar: MatSnackBar = (window as any).rootInjector.get(MatSnackBar);
  const transloco: TranslocoService = (window as any).rootInjector.get(TranslocoService);

  return <T>(source$: Observable<T>) => {
    return source$.pipe(
      tap(() => {
        if (finalOptions.success) {
          snackBar.open(
            transloco.translate(finalOptions.success as string),
            transloco.translate('GENERAL.DISMISS'),
            {
              duration: 5000
            }
          );
        }
      }),
      catchError(err => {
        if (finalOptions.error || finalOptions.showThrownError) {
          snackBar.open(
            finalOptions.showThrownError && (err || err.message) ?
              (err || err.message) : transloco.translate(finalOptions.error as string),
            transloco.translate('GENERAL.DISMISS'),
            {
              panelClass: 'snack-bar-error',
              duration: 5000
            }
          );
        }

        console.error(err);
        return throwError(() => err);
      })
    );
  };
}
