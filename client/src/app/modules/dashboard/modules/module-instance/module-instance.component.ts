import {ChangeDetectionStrategy, Component, Injector, OnInit} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {ActivatedRoute} from '@angular/router';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';
import {ELEMENT_SELECTOR} from '../../../../elements/elements.const';
import {StateService} from '../../../../shared/services/state/state.service';
import {InstanceOverviewContextService} from './services/instance-overview-context.service';

@Component({
  selector: 'jms-module-instance',
  templateUrl: './module-instance.component.html',
  styleUrls: ['./module-instance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleInstanceComponent implements OnInit {
  constructor(
    private state: StateService,
    private activatedRoute: ActivatedRoute,
    private ioc: InstanceOverviewContextService,
    private injector: Injector
  ) {

    /**
     * Register custom elements
     */
    if (!this.state.elementsRegistered) {
      ELEMENT_SELECTOR.forEach(({component, selector}) => {
        const element = createCustomElement(component, {injector});
        customElements.define(selector, element);
      });
      this.state.elementsRegistered = true;
    }
  }

  ngOnInit() {
    this.ioc.module$ = this.activatedRoute.params.pipe(
      switchMap(params =>
        this.state.modules$.pipe(
          map(modules => modules.find(module => module.id === params.id)),
          take(1)
        )
      ),
      shareReplay(1)
    );
  }
}
