import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeUrl'
})
export class SanitizeUrlPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  transform(value: any): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}
