import { Component, Input } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { VehiclePersonalInquiryModalComponent } from '../../../shared/components/vehicle-personal-inquiry-modal/vehicle-personal-inquiry-modal.component';
import { IconDirective } from '@coreui/icons-angular';
@Component({
    selector: 'app-vehicle-loading',
    standalone: true,
    imports: [
        CommonModule,
        NgIf,
        NgFor,
        VehiclePersonalInquiryModalComponent,
        IconDirective
    ],
    templateUrl: './vehicle-loading.component.html'
})
export class VehicleLoadingComponent {
    @Input() vehicles: any[] = [];
    showInquiryModal = false;
    selectedVehicleName: string | null = null;
    @Input() isLoading: boolean = false;

    constructor(private router: Router) { }

    goToVehicleDetail(id: string) {
        this.router.navigate(['/vehicle-detail', id]);
    }

    openVehiclePersonalInquiryModal(vehicleName: string) {
        this.selectedVehicleName = vehicleName;
        this.showInquiryModal = true;
    }

    closeVehiclePersonalInquiryModal() {
        this.showInquiryModal = false;
        this.selectedVehicleName = null;
    }
}

