import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {BASE_TITLE} from '../consts/base-title.const';

@Injectable({
  providedIn: 'root'
})
export class MetaResolver implements Resolve<boolean> {
  constructor(private title: Title, private meta: Meta) {}

  resolve(route: ActivatedRouteSnapshot | {data: {meta: any}}) {
    const valuesToSet = {...(route.data.meta || {})};

    this.title.setTitle(
      valuesToSet.title ? `${valuesToSet.title} - ${BASE_TITLE}` : BASE_TITLE
    );

    /**
     * To prevent iterating over the title and adding it as meta
     */
    delete valuesToSet.title;

    /**
     * Written like this instead of Object.entries to support older browsers
     */
    for (const name in valuesToSet) {
      if (valuesToSet.hasOwnProperty(name)) {
        this.meta.updateTag({name, content: valuesToSet[name]});
      }
    }

    return true;
  }
}
