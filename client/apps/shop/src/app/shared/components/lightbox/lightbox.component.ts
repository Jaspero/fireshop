import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ImageData} from '@jf/interfaces/image-data.interface';

@Component({
  selector: 'jfs-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public imageData: ImageData) {}

  sliderNeeded: boolean;
  sliderIndex = 0;

  ngOnInit() {
    this.sliderNeeded = this.imageData.images.length > 1;
  }

  next() {
    if (this.sliderIndex >= this.imageData.images.length - 1) {
      this.sliderIndex = 0;
    } else {
      this.sliderIndex++;
    }
  }

  previous() {
    if (this.sliderIndex <= 0) {
      this.sliderIndex = this.imageData.images.length - 1;
    } else {
      this.sliderIndex--;
    }
  }
}
