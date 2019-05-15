import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {StateService} from '../services/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class StructuredDataResolver implements Resolve<boolean> {
  constructor(private state: StateService) {}

  resolve(route: ActivatedRouteSnapshot | {data: {structuredData: any}}) {
    const valuesToSet = route.data.structuredData || {};

    this.state.structuredData = {
      '@context': 'https://schema.org/',
      ...valuesToSet
    };

    return true;
  }
}
