import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-modal',
  imports:[CommonModule],
  templateUrl: './profile-modal.component.html',
  standalone: true,
})
export class ProfileModalComponent {
  @Output() close = new EventEmitter<void>();

  selectedTab: string = 'dashboard'; // default tab

  onClose() {
    this.close.emit();
  }

  setTab(tab: string) {
    this.selectedTab = tab;
  }
}
