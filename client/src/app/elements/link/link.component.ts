import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'jms-e-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent {
  @Input()
  link: string;

  @Input()
  color: ThemePalette;
}
