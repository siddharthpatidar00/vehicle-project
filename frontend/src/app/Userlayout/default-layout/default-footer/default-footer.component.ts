import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, FooterModule } from '@coreui/angular';
import { SearchModalComponent } from '../../../views/User/components/search-modal/search-modal.component';

@Component({
  selector: 'app-default-footer',
  standalone:true,
  imports: [
    FooterModule,
    RouterModule,
    SearchModalComponent
  ],
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss']
})
export class DefaultFooterComponent extends FooterComponent {
  currentYear: number;
  constructor() {
    super();
    this.currentYear = new Date().getFullYear();
  }

  showSearchModal = false;
  // mobileMenuOpen: boolean = false;

  openSearchModal() {
    this.showSearchModal = true;
  }

  closeSearchModal() {
    this.showSearchModal = false;
  }
}
