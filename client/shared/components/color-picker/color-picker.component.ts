import {DOCUMENT} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {BROWSER_CONFIG} from '../../consts/browser-config.const';

interface Theme {
  label: string;
  class: string;
  primary: string;
  accent: string;
  warn: string;
  active: boolean;
}

@Component({
  selector: 'jfs-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  themes: Theme[] = [
    {
      label: 'Theme one',
      primary: '#3f51b5',
      // TODO: Define
      accent: '#000',
      warn: '#000',
      class: 'one',
      active: false
    },
    {
      label: 'Theme two',
      primary: '#37474f',
      // TODO: Define
      accent: '#000',
      warn: '#000',
      class: 'two',
      active: false
    },
    {
      label: 'Theme three',
      primary: '#673ab7',
      // TODO: Define
      accent: '#000',
      warn: '#000',
      class: 'three',
      active: false
    },
    {
      label: 'Theme four',
      primary: '#8d6e63',
      // TODO: Define
      accent: '#000',
      warn: '#000',
      class: 'four',
      active: false
    }
  ];

  open = false;

  ngOnInit() {
    if (BROWSER_CONFIG.isBrowser) {
      const activeTheme = localStorage.getItem('theme') || this.themes[0].label;
      this.select(this.themes.find(theme => theme.label === activeTheme));
    }
  }

  toggle() {
    this.open = !this.open;
  }

  select(theme: Theme) {
    this.document.documentElement.style.setProperty('--primary', theme.primary);
    this.document.documentElement.style.setProperty('--accent', theme.accent);
    this.document.documentElement.style.setProperty('--warn', theme.warn);

    localStorage.setItem('theme', theme.label);

    theme.active = true;
  }
}
