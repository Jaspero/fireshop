import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'jfsc-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent implements OnInit {
  constructor() {}

  @ViewChild('file')
  fileEl: ElementRef<HTMLInputElement>;

  ngOnInit() {}

  selectFile(event) {
    console.log('event', event);
  }
}
