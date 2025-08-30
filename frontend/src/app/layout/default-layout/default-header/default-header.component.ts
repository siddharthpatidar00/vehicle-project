import { NgTemplateOutlet, NgIf } from '@angular/common';
import { Component, computed, inject, input, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  AvatarComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderNavComponent
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { LocationService } from '../../../shared/services/location.service';
import { SearchModalComponent } from '../../../shared/components/search-modal/search-modal.component';
import { ProfileModalComponent } from '../../../shared/components/profile-modal/profile-modal.component';
import { AuthService } from '../../../shared/services/auth.service';
import { InquiryModalComponent } from '../../../shared/components/inquiry-modal/inquiry-modal.component';
import { TransportVehicleComponent } from '../../../views/transport-vehicle/transport-vehicle.component';
import { SellVehicleModalComponent } from '../../../shared/components/sell-vehicle-modal/sell-vehicle-modal.component';
import { ApplyForLoanComponent } from '../../../shared/components/apply-for-loan/apply-for-loan.component';
import { BuyOrRenewInsuranceComponent } from '../../../shared/components/buy-or-renew-insurance/buy-or-renew-insurance.component';

@Component({
  selector: 'app-default-header',
  styleUrl: './default-header.component.scss',
  templateUrl: './default-header.component.html',
  imports: [
    ContainerComponent,
    IconDirective,
    HeaderNavComponent,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    DropdownComponent,
    DropdownToggleDirective,
    AvatarComponent,
    DropdownMenuDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    NgIf,
    SearchModalComponent,
    ProfileModalComponent,
    InquiryModalComponent,
    TransportVehicleComponent,
    SellVehicleModalComponent,
    ApplyForLoanComponent,
    BuyOrRenewInsuranceComponent
  ]
})
export class DefaultHeaderComponent implements OnInit, OnDestroy {
  selectedLocation: string = 'Location';
  private locationSubscription!: Subscription;
  userNickname: string | null = null;

  constructor(
    private locationService: LocationService,
    public authService: AuthService,
    private router: Router
  ) { }

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  showProfileModal = false;
  showSellVehicleModal = false


  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  ngOnInit(): void {
    this.locationSubscription = this.locationService.locationName$.subscribe(name => {
      this.selectedLocation = name;
    });

    this.authService.user$.subscribe(user => {
      this.userNickname = user?.nickname ?? null;
    });
  }



  ngOnDestroy(): void {
    this.locationSubscription?.unsubscribe();
  }

  sidebarId = input('sidebar1');

  toggleNew: boolean = false;
  toggleUsed: boolean = false;
  user: any = null;
  mobileMenuOpen: boolean = false;
  userDropdown = null;
  showSearchModal = false;
  showInquiryModal = false;
  showTransportModal = false;
  showApplyForLoanModalOpen = false;
  showBuyOrRenewInsuranceModalOpen = false
  openLocationModal() {
    this.locationService.triggerModal();
  }

  openSearchModal() {
    this.showSearchModal = true;
  }

  closeSearchModal() {
    this.showSearchModal = false;
  }

  openInquiryModal() {
    this.showInquiryModal = true;
  }

  closeInquiryModal() {
    this.showInquiryModal = false;
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

  openTransportModal() {
    this.showTransportModal = true;
  }

  closeTransportModal() {
    this.showTransportModal = false;
  }

  openProfileModal() {
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
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


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  selectLocation(city: string) {
    this.locationService.setLocation(city);
    console.log(this.selectLocation)
  }

}
