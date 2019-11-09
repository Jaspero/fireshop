import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';
import {Module} from '../../shared/interfaces/module.interface';
import {StateService} from '../../shared/services/state/state.service';

@Component({
  selector: 'jms-module-instance',
  templateUrl: './module-instance.component.html',
  styleUrls: ['./module-instance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleInstanceComponent implements OnInit {
  constructor(
    private state: StateService,
    private activatedRoute: ActivatedRoute
  ) {}

  module$: Observable<Module>;

  ngOnInit() {
    this.module$ = this.activatedRoute.params.pipe(
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
