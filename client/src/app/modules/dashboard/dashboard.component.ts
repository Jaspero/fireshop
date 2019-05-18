import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'jms-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
