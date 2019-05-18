import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'jms-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
