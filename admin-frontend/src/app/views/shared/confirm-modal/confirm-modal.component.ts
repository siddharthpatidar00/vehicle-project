import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalModule } from '@coreui/angular';
import { ButtonModule } from '@coreui/angular';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [ModalModule, ButtonModule],
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  close() {
    this.onCancel.emit();
  }

  confirm() {
    this.onConfirm.emit();
  }
}
