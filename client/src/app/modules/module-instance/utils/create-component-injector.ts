import {PortalInjector} from '@angular/cdk/portal';
import {InjectionToken} from '@angular/core';

export const COMPONENT_DATA = new InjectionToken<{}>('COMPONENT_DATA');

export function createComponentInjector(injector, dataToPass): PortalInjector {
  const injectorTokens = new WeakMap();
  injectorTokens.set(COMPONENT_DATA, dataToPass);
  return new PortalInjector(injector, injectorTokens);
}
