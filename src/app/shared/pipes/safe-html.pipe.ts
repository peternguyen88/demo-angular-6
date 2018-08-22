import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Pipe({name: 'truncate'})
export class TruncatePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      const limit = 100;
      const trail = '...';
      return value.length > limit ? value.substring(0, limit) + trail : value;
    } else {
      return null;
    }
  }
}
