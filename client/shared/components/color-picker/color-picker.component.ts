import {Component} from '@angular/core';

@Component({
  selector: 'jfs-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  constructor() {}

  colorPicker: boolean;

  openColorPicker() {
    this.colorPicker = !this.colorPicker;
  }
}
