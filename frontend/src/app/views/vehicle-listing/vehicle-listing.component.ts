import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleListingService } from '../../shared/services/vehicle.listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleFilterComponent } from './vehicle-filter/vehicle-filter.component';
import { VehicleLoadingComponent } from "./vehicle-loading/vehicle-loading.component";

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

  constructor(
    private vehicleService: VehicleListingService,
    private route: ActivatedRoute,
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

}
