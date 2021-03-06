import {defer, Observable, throwError} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import {StateService} from '../services/state/state.service';

const cq = [];

export function queue(
  name?: string | number
): <T>(source$: Observable<T>) => Observable<T> {
  const state: StateService = (window as any).rootInjector.get(StateService);

  return <T>(source$: Observable<T>) => {
    return defer(() => {
      name = name || new Date().getTime() + Math.random();
      cq.push(name);
      state.loadingQue$.next(cq);

      return source$.pipe(
        finalize(() => {
          const index = cq.indexOf(name);
          if (index !== -1) {
            cq.splice(index, 1);
          }

          state.loadingQue$.next(cq);
        }),
        catchError(err => {
          const index = cq.indexOf(name);

          if (index !== -1) {
            cq.splice(index, 1);
          }

          state.loadingQue$.next(cq);

          return throwError(err);
        })
      );
    });
  };

}
