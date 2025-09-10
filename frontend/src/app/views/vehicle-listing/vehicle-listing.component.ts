import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleListingService } from '../../shared/services/vehicle.listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleFilterComponent } from './vehicle-filter/vehicle-filter.component';
import { VehicleLoadingComponent } from "./vehicle-loading/vehicle-loading.component";
import { AdvertisementService, Advertisement } from '../../shared/services/advertisement.service';

@Component({
  selector: 'app-vehicle-listing',
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
    ReactiveFormsModule,
    FormsModule,
    VehicleFilterComponent,
    VehicleLoadingComponent
  ],
  templateUrl: './vehicle-listing.component.html'
})
export class VehicleListingComponent implements OnInit {
  vehicles: any[] = [];
  currentPage = 1;
  itemsPerPage = 16;
  categoryId: string | null = null;
  isLoading = true;
  ad2Image: string = '';

  constructor(
    private vehicleService: VehicleListingService,
    private route: ActivatedRoute,
    private advertisementService: AdvertisementService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryName = params['category_name'] || null;
      const minPrice = params['minPrice'] ? Number(params['minPrice']) : undefined;
      const maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : undefined;

      this.categoryId = categoryName;

      this.fetchVehicles({
        category_name: this.categoryId || undefined,
        minPrice,
        maxPrice
      });
    });
    this.loadAd2();
  }


  fetchVehicles(filter?: {
    category_id?: string;
    category_name?: string;
    brand_name?: string;
    minPrice?: number;
    maxPrice?: number;
  }): void {
    this.isLoading = true;
    this.vehicles = [];

    this.vehicleService.getAllVehicles(filter).subscribe({
      next: (data) => {
        this.vehicles = data || [];
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching vehicles:', err);
        this.vehicles = [];
        this.isLoading = false;
      }
    });
  }

  get paginatedVehicles() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.vehicles.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.vehicles.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  onFilterApplied(filter: {
    category_id?: string;
    category_name?: string;
    brand_name?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    // ✅ Update query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category_name: filter.category_name || null,
        brand_name: filter.brand_name || null,
        minPrice: filter.minPrice || null,
        maxPrice: filter.maxPrice || null
      },
      queryParamsHandling: 'merge' // keep existing ones
    });

    // ✅ Fetch vehicles with filter
    this.fetchVehicles(filter);
  }


  loadAd2(): void {
    this.advertisementService.getAdByType('ad2').subscribe({
      next: (ad) => {
        if (ad && ad.image) {
          this.ad2Image = ad.image.startsWith('http') ? ad.image : `http://localhost:5000${ad.image}`;
        }
      },
      error: (err) => console.error('Failed to load ad2', err)
    });
  }

}
