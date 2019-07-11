import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'jfs-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {images: string[]; initialSlide?: number}
  ) {}

  sliderNeeded: boolean;
  sliderIndex = 0;

  ngOnInit() {
    this.sliderNeeded = this.data.images.length > 1;

    if (this.data.initialSlide) {
      this.sliderIndex = this.data.initialSlide;
    }
  }
}
