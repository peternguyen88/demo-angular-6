import {NgModule} from '@angular/core';
import {DigitalTimeDirective} from '../directives/gm-digital-time.directive';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SafeHtmlPipe, TruncatePipe} from '../pipes/safe-html.pipe';

/**
 * This module will be imported by other modules
 */
@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule],
  declarations: [DigitalTimeDirective, ConfirmDialogComponent, SafeHtmlPipe, TruncatePipe],
  exports: [DigitalTimeDirective, ConfirmDialogComponent, SafeHtmlPipe, TruncatePipe]
})
export class GmatCommonModule {
}
