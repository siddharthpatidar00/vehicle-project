import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleListingService } from '../../shared/services/vehicle.listing.service';
import { CommonModule } from '@angular/common';
import { VehiclePersonalInquiryModalComponent } from '../../shared/components/vehicle-personal-inquiry-modal/vehicle-personal-inquiry-modal.component';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, VehiclePersonalInquiryModalComponent],
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {
  vehicle: any;
  showInquiryModal = false;
  selectedVehicleName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleListingService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadVehicleDetails(id);
      }
    });
  }

  loadVehicleDetails(id: string) {
    this.vehicleService.getVehicleById(id).subscribe({
      next: (data) => {
        console.log('Fetched vehicle:', data);
        this.vehicle = data;
      },
      error: (err) => {
        console.error('Error fetching vehicle details:', err);
      }
    });
  }

  getVehicleImageUrl(imgPath: string): string {
    if (!imgPath) return '';
    return `http://localhost:5000${imgPath}`;
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
