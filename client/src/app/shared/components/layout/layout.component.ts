import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StateService} from '../../services/state/state.service';

@Component({
  selector: 'jms-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  constructor(public state: StateService) {}

  sidebarExpanded = false;

  expandSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}
