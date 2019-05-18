import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StateService} from './shared/services/state/state.service';

@Component({
  selector: 'jms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(public state: StateService) {}

  sidebarExpanded = false;

  expandSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}
