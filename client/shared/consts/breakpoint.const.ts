import {
  distinctUntilChanged,
  map,
  shareReplay,
  startWith
} from 'rxjs/operators';
import {fromEvent, Observable} from 'rxjs';

export enum Breakpoint {
  xs = 'screen-xs',
  s = 'screen-s',
  m = 'screen-m',
  l = 'screen-l',
  xl = 'screen-xl'
}

export const BREAKPOINTS = {
  [Breakpoint.xs]: [0, 600],
  [Breakpoint.s]: [600, 900],
  [Breakpoint.m]: [900, 1200],
  [Breakpoint.l]: [1200, 1800],
  [Breakpoint.xl]: [1800, 5000]
};

export const currentBreakpoint$: Observable<string> = fromEvent(
  window,
  'resize'
).pipe(
  startWith(detectBreakpoint()),
  map(() => detectBreakpoint()),
  shareReplay(1),
  distinctUntilChanged()
);

function detectBreakpoint() {
  for (const key in BREAKPOINTS) {
    if (
      BREAKPOINTS[key][0] <= window.innerWidth &&
      window.innerWidth < BREAKPOINTS[key][1]
    ) {
      return key;
    }
  }
}
