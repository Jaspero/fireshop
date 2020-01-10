import {ChangeDetectionStrategy, Component, Injector, OnInit} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {ELEMENT_SELECTOR} from './elements/elements.const';
import {StateService} from './shared/services/state/state.service';

@Component({
  selector: 'jms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(
    private state: StateService,
    private injector: Injector
  ) {

    /**
     * Register custom elements
     */
    ELEMENT_SELECTOR.forEach(({component, selector}) => {
      const element = createCustomElement(component, {injector});
      customElements.define(selector, element);
    });
  }

  loading$: Observable<boolean>;

  ngOnInit() {
    this.loading$ = this.state.loadingQue$.pipe(
      debounceTime(200),
      map(items => !!items.length)
    );
  }
}
