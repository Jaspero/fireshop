import {Observable, throwError} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import {StateService} from '../services/state/state.service';

const _queue = [];

export function queue(
  name?: string | number
): <T>(source$: Observable<T>) => Observable<T> {
  const state: StateService = window['rootInjector'].get(StateService);

  return <T>(source$: Observable<T>) => {
    return source$.pipe(
      tap(() => {
        name = name || Date.now();
        _queue.push(name);

        state.loadingQue$.next(_queue);
      }),
      finalize(() => {
        const index = _queue.indexOf(name);

        if (index !== -1) {
          _queue.splice(index, 1);
        }

        state.loadingQue$.next(_queue);
      }),
      catchError(err => {
        const index = _queue.indexOf(name);

        if (index !== -1) {
          _queue.splice(index, 1);
        }

        state.loadingQue$.next(_queue);

        return throwError(err);
      })
    );
  };
}
