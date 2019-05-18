import {PortalInjector} from '@angular/cdk/portal';
import {InjectionToken} from '@angular/core';

export const SEGMENT_DATA = new InjectionToken<{}>('SEGMENT_DATA');

export function createSegmentInjector(injector, dataToPass): PortalInjector {
  const injectorTokens = new WeakMap();
  injectorTokens.set(SEGMENT_DATA, dataToPass);
  return new PortalInjector(injector, injectorTokens);
}
