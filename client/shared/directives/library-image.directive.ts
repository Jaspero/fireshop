import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {BROWSER_CONFIG} from '../consts/browser-config.const';

@Directive({
  selector: '[jfsLibraryImage]'
})
export class LibraryImageDirective {
  constructor(
    private _http: HttpClient,
    private _renderer: Renderer2,
    private _el: ElementRef
  ) {}

  static FIRESHOP_URL = `https://firebasestorage.googleapis.com/v0/b/${ENV_CONFIG.firebase.storageBucket}/o/`;

  @Input()
  webp = true;
  @Input()
  size: string;
  @Input()
  set jfsLibraryImage(item: string) {
    if (!item) {
      this.setValue('assets/images/missing-image.svg');
      return;
    }

    if (!item.includes(LibraryImageDirective.FIRESHOP_URL)) {
      this.setValue(item);
      return;
    }

    let valToUse = item;

    if (this.size === 'm' || this.size === 's') {
      valToUse = `${LibraryImageDirective.FIRESHOP_URL}thumb_${this.size}_${
        valToUse.split(LibraryImageDirective.FIRESHOP_URL)[1]
      }`;
    }


    if (
      (this.webp && BROWSER_CONFIG.webpSupported) ||
      this.size === 'm' ||
      this.size === 's'
    ) {
      valToUse = valToUse.replace(
        LibraryImageDirective.FIRESHOP_URL,
        LibraryImageDirective.FIRESHOP_URL + 'generated%2F'
      );
    }

    if (this.webp && BROWSER_CONFIG.webpSupported) {
      valToUse = valToUse.replace(
        /(\.jpg|\.jpeg|\.png)/i,
        `${this.webp && BROWSER_CONFIG.webpSupported ? '.webp' : '$1'}`
      );
    }

    this._http
      .get(valToUse, {responseType: 'blob', withCredentials: false})
      .subscribe(
        res => {
          const urlCreator = window.URL || window['webkitURL'];
          this.setValue(urlCreator.createObjectURL(res));
        },
        () => {
          this.setValue('/assets/images/missing-image.svg');
        }
      );
  }

  setValue(value: string) {
    /**
     * If the directive isn't attached to an img element
     * then it needs to attach a background style instead
     * of a src attribute
     */
    if (this._el.nativeElement.tagName !== 'IMG') {
      this._renderer.setStyle(
        this._el.nativeElement,
        'background-image',
        `url(${value})`
      );
    } else {
      this._renderer.setAttribute(this._el.nativeElement, 'src', value);
    }
  }
}
