import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleListingService } from '../../shared/services/vehicle.listing.service';
import { CommonModule } from '@angular/common';
import { VehiclePersonalInquiryModalComponent } from '../../shared/components/vehicle-personal-inquiry-modal/vehicle-personal-inquiry-modal.component';
import { AdvertisementService, Advertisement } from '../../shared/services/advertisement.service';
import { SellVehicleService, SellVehicle } from '../../shared/services/vehicle.sells.service';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, VehiclePersonalInquiryModalComponent, RouterModule],
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {
  vehicle: any;
  showInquiryModal = false;
  selectedVehicleName: string | null = null;
  selectedImageIndex = 0;
  ad3: Advertisement | null = null;
  vehicles: SellVehicle[] = [];
  randomVehicles: SellVehicle[] = [];

  constructor(
    private route: ActivatedRoute,
    private vehicleListingService: VehicleListingService,
    private adService: AdvertisementService,
    private sellVehicleService: SellVehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load all vehicles once
    this.sellVehicleService.getVehicle().subscribe({
      next: data => {
        this.vehicles = data;

        // Listen to route changes to reload vehicle details and suggested vehicles
        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.loadVehicleDetails(id);
            this.pickRandomVehicles(id); // refresh suggested vehicles
          }
        });
      },
      error: err => console.error('Error fetching vehicles:', err)
    });

    // Load ad3 once
    this.adService.getAdByType('ad3').subscribe({
      next: ad => (this.ad3 = ad || null),
      error: err => console.error('Error fetching ad3:', err)
    });
  }

  loadVehicleDetails(id: string) {
    this.vehicleListingService.getVehicleById(id).subscribe({
      next: data => {
        this.vehicle = data;
        this.selectedImageIndex = 0; // reset selected image on vehicle change
      },
      error: err => console.error('Error fetching vehicle details:', err)
    });
  }

  pickRandomVehicles(currentVehicleId?: string) {
    if (this.vehicles.length > 0) {
      // Exclude the current vehicle
      const filtered = currentVehicleId
        ? this.vehicles.filter(v => v._id !== currentVehicleId)
        : [...this.vehicles];

      // Shuffle and pick first 2 vehicles
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      this.randomVehicles = shuffled.slice(0, 2);
    }
  }

  getVehicleImageUrl(imgPath: string | null | undefined): string {
    return imgPath ? `http://localhost:5000${imgPath}` : 'assets/images/no-image.jpg';
  }

  openVehiclePersonalInquiryModal(vehicleName: string) {
    this.selectedVehicleName = vehicleName;
    this.showInquiryModal = true;
  }

  closeVehiclePersonalInquiryModal() {
    this.showInquiryModal = false;
    this.selectedVehicleName = null;
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  goToVehicleDetails(vehicleId: string) {
    this.router.navigate(['/vehicle-detail', vehicleId]);
  }
}
