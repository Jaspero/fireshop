import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NetworkService} from '../../services/network/network.service';

@Component({
  selector: 'jfs-network-widget',
  templateUrl: './network-widget.component.html',
  styleUrls: ['./network-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkWidgetComponent {
  constructor(public networkService: NetworkService) {}
}
