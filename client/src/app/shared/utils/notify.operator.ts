import {MatSnackBar} from '@angular/material';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

const DEFAULT_OPTIONS = {
  success: 'Operation completed',
  error: 'Operation failed'
};

export function notify(
  options: {
    success?: string;
    error?: string;
  } = {}
): <T>(source$: Observable<T>) => Observable<T> {
  const finalOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const snackBar: MatSnackBar = window['rootInjector'].get(MatSnackBar);

  return <T>(source$: Observable<T>) => {
    return source$.pipe(
      tap(() => {
        if (finalOptions.success) {
          snackBar.open(finalOptions.success, 'Dismiss', {
            duration: 5000
          });
        }
      }),
      catchError(err => {
        if (finalOptions.error) {
          snackBar.open(finalOptions.error, 'Dismiss', {
            panelClass: 'snack-bar-error',
            duration: 5000
          });
        }

        console.error(err);
        return throwError(err);
      })
    );
  };
}
