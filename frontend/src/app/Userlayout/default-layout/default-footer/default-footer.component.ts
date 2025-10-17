import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent, FooterModule } from '@coreui/angular';
import { SearchModalComponent } from '../../../views/User/components/search-modal/search-modal.component';
import { CommonModule } from '@angular/common';
import { TransportVehicleComponent } from '../../../views/User/transport-vehicle/transport-vehicle.component';
import { InquiryModalComponent } from '../../../views/User/components/inquiry-modal/inquiry-modal.component';
import { SellVehicleModalComponent } from '../../../views/User/components/sell-vehicle-modal/sell-vehicle-modal.component';
import { UserAuthService } from '../../../services/user.auth.service';
import { ApplyForLoanComponent } from '../../../views/User/components/apply-for-loan/apply-for-loan.component';
import { BuyOrRenewInsuranceComponent } from '../../../views/User/components/buy-or-renew-insurance/buy-or-renew-insurance.component';

@Component({
  selector: 'app-default-footer',
  standalone: true,
  imports: [
    CommonModule,
    FooterModule,
    RouterModule,
    SearchModalComponent,
    TransportVehicleComponent,
    InquiryModalComponent,
    SellVehicleModalComponent,
    ApplyForLoanComponent,
    BuyOrRenewInsuranceComponent
  ],
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss']
})
export class DefaultFooterComponent extends FooterComponent {
  currentYear: number;
  userNickname: string | null = null;
  constructor(public authService: UserAuthService, private router: Router) {
    super();
    this.currentYear = new Date().getFullYear();
  }

  showSearchModal = false;
  showTransportModal = false;
  showInquiryModal = false;
  showSellVehicleModal = false
  showApplyForLoanModalOpen = false;
  showBuyOrRenewInsuranceModalOpen = false
  // mobileMenuOpen: boolean = false;

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.userNickname = user?.nickname ?? null;
    });
  }

  openSearchModal() {
    this.showSearchModal = true;
  }

  closeSearchModal() {
    this.showSearchModal = false;
  }
  openTransportModal() {
    this.showTransportModal = true;
  }

  closeTransportModal() {
    this.showTransportModal = false;
  }
  openInquiryModal() {
    this.showInquiryModal = true;
  }

  closeInquiryModal() {
    this.showInquiryModal = false;
  }
  openSellVehicleModal() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.showSellVehicleModal = true;
    }
  }

  closeSellVehicleModal() {
    this.showSellVehicleModal = false;
  }

  openApplyForLoanModal() {
    this.showApplyForLoanModalOpen = true;
  }

  closeApplyForLoanModal() {
    this.showApplyForLoanModalOpen = false;
  }

  openBuyOrRenewInsuranceModal() {
    this.showBuyOrRenewInsuranceModalOpen = true;
  }

  closeBuyOrRenewInsuranceModal() {
    this.showBuyOrRenewInsuranceModalOpen = false;
  }
}
