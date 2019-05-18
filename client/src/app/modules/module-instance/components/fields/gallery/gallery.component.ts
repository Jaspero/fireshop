import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface GalleryData extends FieldData {
  allowUrl?: boolean;
  allowServerUpload?: boolean;
}

@Component({
  selector: 'jms-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent extends FieldComponent<GalleryData> {}
