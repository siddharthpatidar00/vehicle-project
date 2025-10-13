import { Component, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { FormModule } from '@coreui/angular';
import { cilFilter } from '@coreui/icons';
import { FilterService } from '../../../../services/filter.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-vehicle-filter',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IconModule,
        FormModule
    ],
    templateUrl: './vehicle-filter.component.html'
})
export class VehicleFilterComponent {
    @Output() filterApplied = new EventEmitter<{
        category_name?: string;
        category_id?: string;
        brand_name?: string;
        minPrice?: number;
        maxPrice?: number;
    }>();
    @Input() selectedCategoryName: string = '';

    selectedCategoryId: string = '';
    selectedBrand: string = '';

    // Slider values
    minValue: number = 0;
    maxValue: number = 0;

    cilFilter = cilFilter;

    categories: any[] = [];
    brands: any[] = [];
    priceRange: any = {};

    isSidebarOpen: boolean = false;
    isMobile: boolean = false;

    selectedCategory: string | null = null;

    brandDropdownOpen: boolean = false;
    categoryDropdownOpen: boolean = false;

    filteredVehicles: any[] = [];

    constructor(private filterService: FilterService) {
        this.checkScreenWidth();
    }

    ngOnInit() {
        this.loadFilters();
    }


    // ✅ Listen to window resize
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkScreenWidth();
    }

    checkScreenWidth() {
        this.isMobile = window.innerWidth < 768;
        // Always open sidebar on desktop
        if (!this.isMobile) {
            this.isSidebarOpen = true;
        }
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    toggleBrandDropdown(event: Event) {
        event.stopPropagation(); // prevent document click from closing immediately
        this.brandDropdownOpen = !this.brandDropdownOpen;
    }

    toggleCategoryDropdown(event: Event) {
        event.stopPropagation();
        this.categoryDropdownOpen = !this.categoryDropdownOpen;
    }

    selectBrand(name: string, event: Event) {
        event.stopPropagation(); // prevent dropdown toggle
        this.selectedBrand = name;
        this.brandDropdownOpen = false;
    }

    selectCategory(name: string, event: Event) {
        event.stopPropagation();
        this.selectedCategory = name;
        this.categoryDropdownOpen = false;
    }

    loadFilters() {
        this.filterService.getFilters().subscribe({
            next: (res) => {
                console.log('[Filters API Response]', res);

                if (res.code && res.result?.filters) {
                    const filters = res.result.filters;

                    this.brands = filters.brands || [];
                    this.categories = filters.categories || [];
                    this.priceRange = filters.price || {};

                    console.log('[Brands]', this.brands);
                    console.log('[Categories]', this.categories);
                    console.log('[Price Range]', this.priceRange);

                    // Set initial min & max slider values from API
                    if (this.priceRange.minOriginal) {
                        this.minValue = this.priceRange.minOriginal;
                    }
                    if (this.priceRange.maxOriginal) {
                        this.maxValue = this.priceRange.maxOriginal;
                    }
                }
            },
            error: (err) => {
                console.error('Failed to load filters:', err);
            }
        });
    }

    applyFilter() {
        const appliedFilter = {
            category: this.selectedCategory?.trim() || undefined,
            brand: this.selectedBrand?.trim() || undefined,
            minPrice: this.minValue || 0,
            maxPrice: this.maxValue || this.priceRange.maxOriginal || 0,
        };

        console.log('[Applied Filter]', appliedFilter);

        // Send the filter to backend
        this.filterService.getFilteredVehicles(appliedFilter).subscribe((res) => {
            if (res.code) {
                // ✅ Store the filtered vehicles
                this.filteredVehicles = res.result.vehicles || [];
                console.log('Filtered Vehicles:', this.filteredVehicles);
            }
        });

        if (this.isMobile) {
            this.isSidebarOpen = false;
        }
    }


    @HostListener('document:click', ['$event'])
    onDocumentClick() {
        this.brandDropdownOpen = false;
        this.categoryDropdownOpen = false;
    }
}

