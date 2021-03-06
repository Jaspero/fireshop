import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {StateService} from '../../../../shared/services/state/state.service';
import {InstanceOverviewContextService} from './services/instance-overview-context.service';
import {findModule} from './utils/find-module';

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
    private ioc: InstanceOverviewContextService
  ) {}

  ngOnInit() {
    this.ioc.module$ = this.activatedRoute.params.pipe(
      switchMap(params =>
        this.state.modules$.pipe(
          map(modules => {
            const module = findModule(modules, params);

            if (module && module.id.includes('{docId}')) {
              module.id = module.id.replace('{docId}', params.documentId);
            }

            return module;
          }),
          take(1)
        )
      ),
      tap(module => {
        this.state.page$.next(module ? {module: {id: module.id, name: module.name}} : {});
      }),
      shareReplay(1)
    );
  }
}
