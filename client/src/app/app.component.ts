import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {StateService} from './shared/services/state/state.service';
import {DEFINITION_TEMPLATES} from './modules/module-definition/pages/definition-instance/consts/definition-templates.const';

@Component({
  selector: 'jms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(
    private state: StateService
  ) {}

  loading$: Observable<boolean>;

  ngOnInit() {
    this.loading$ = this.state.loadingQue$.pipe(
      debounceTime(200),
      map(items => !!items.length)
    );
  }
}
