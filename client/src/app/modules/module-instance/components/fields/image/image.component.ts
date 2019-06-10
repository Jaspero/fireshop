import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface ImageData extends FieldData {
  allowUrl?: boolean;
  allowServerUpload?: boolean;
}

@Component({
  selector: 'jms-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent extends FieldComponent<ImageData>
  implements OnInit {
  data = [];

  ngOnInit() {
    console.log(this.cData.control.value);
  }
}
