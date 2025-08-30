import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { FormModule } from '@coreui/angular';
import { cilFilter } from '@coreui/icons';
import { FilterService } from '../../../shared/services/filter.service';
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

    // ✅ Keep two values for slider (min & max)
    minValue: number = 0;
    maxValue: number = 0;

    cilFilter = cilFilter;

    categories: any[] = [];
    brands: any[] = [];
    priceRange: any = {};

    constructor(private filterService: FilterService) { }

    ngOnInit() {
        this.loadFilters();
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

                    // ✅ set initial min & max slider values from API
                    if (this.priceRange.minOriginal) {
                        this.minValue = this.priceRange.minOriginal;
                    }
                    if (this.priceRange.maxOriginal) {
                        this.maxValue = this.priceRange.maxOriginal;
                    }
                }
            },
            error: (err) => {
                console.error('❌ Failed to load filters:', err);
            }
        });
    }

    applyFilter() {
        let categoryName = this.selectedCategoryName?.trim().replace(/\s+/g, ' ');

        console.log('[Applied Filter]', {
            category_id: this.selectedCategoryId || undefined,
            category_name: categoryName || undefined,
            brand_name: this.selectedBrand || undefined,
            minPrice: this.minValue || undefined,
            maxPrice: this.maxValue || undefined,
        });

        this.filterApplied.emit({
            category_id: this.selectedCategoryId || undefined,
            category_name: categoryName || undefined,
            brand_name: this.selectedBrand || undefined,
            minPrice: this.minValue || undefined,
            maxPrice: this.maxValue || undefined,
        });
    }
}
