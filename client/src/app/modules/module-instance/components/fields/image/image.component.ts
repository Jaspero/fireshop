import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'jms-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
