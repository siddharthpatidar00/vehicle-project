import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-inquiry-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inquiry-modal.component.html',
  styleUrl: './inquiry-modal.component.scss'
})
export class InquiryModalComponent {
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit()
  }
}
