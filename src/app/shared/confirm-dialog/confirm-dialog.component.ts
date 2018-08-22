/**
 * Showing Confirmation Dialog
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmMessage} from '../../models/confirm-message';

@Component({
  moduleId: module.id,
  selector: 'app-confirm-dialog',
  templateUrl: 'confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {

  @Output() close = new EventEmitter();

  message: ConfirmMessage;

  @Input() set popupMessage(message: ConfirmMessage) {
    this.message = message;
  }

  constructor() {
  }

  ngOnInit() {
  }

  public closePopup() {
    this.close.emit();
  }

  public accept() {
    if (this.message.accept) {
      this.message.accept();
    }
    this.closePopup();
  }

  public reject() {
    if (this.message.reject) {
      this.message.reject();
    }
    this.closePopup();
  }
}
