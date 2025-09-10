import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleCategoryService } from '../../shared/services/categories.service';
import { CustomerService, Customer } from '../../shared/services/customer.service';
import { BrandService, Brand } from '../../shared/services/brand.service';
import { AdvertisementService, Advertisement } from '../../shared/services/advertisement.service';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgFor, CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    categories: any[] = [];
    customers: Customer[] = [];
    brands: Brand[] = [];
    currentIndex = 0;
    currentPage = 0;
    pageSize = 6;
    intervalId: any;
    isSmallScreen = false;
    isMobile = false;
    images: string[] = ['assets/images/truck.jpg', 'assets/images/1.avif', 'assets/images/2.avif', 'assets/images/3.avif', 'assets/images/4.webp'];
    ad1Image: string = '';

    constructor(
        private vehicleCategoryService: VehicleCategoryService,
        private customerService: CustomerService,
        private brandService: BrandService,
        private advertisementService: AdvertisementService
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        this.loadCustomers();
        this.loadBrands();
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize.bind(this));
        this.loadAd1();
    }

    ngOnDestroy(): void {
        if (this.intervalId) clearInterval(this.intervalId);
        window.removeEventListener('resize', this.checkScreenSize.bind(this));
    }


    loadCategories() {
        this.vehicleCategoryService.getAllCategories().subscribe({
            next: (res) => {
                let categoryList: any[] = [];
                if (Array.isArray(res)) categoryList = res;
                else if (res?.data && Array.isArray(res.data)) categoryList = res.data;
                this.categories = categoryList.filter(
                    (cat: any) => cat.status?.toLowerCase() === 'active'
                );
            },
            error: (err) => console.error('Failed to load categories', err)
        });
    }

    loadCustomers() {
        this.customerService.getAllCustomers().subscribe({
            next: (res) => {
                this.customers = res.map(c => ({
                    ...c,
                    image: c.image.startsWith('http') ? c.image : `http://localhost:5000${c.image}`
                }));

                // Only start auto-scroll if there are more than 4 customers
                if (this.customers.length > 4) {
                    this.intervalId = setInterval(() => this.nextSlide(), 3000);
                }
            },
            error: (err) => console.error('Failed to load customers', err)
        });
    }

    loadBrands() {
        this.brandService.getAll().subscribe({
            next: (res) => {
                this.brands = res.filter(b => b.status.toLowerCase() === 'active');
            },
            error: (err) => console.error('Failed to load brands', err)
        });
    }

    loadAd1() {
        this.advertisementService.getAdByType('ad1').subscribe({
            next: (ad) => {
                if (ad && ad.image) {
                    // Add server base URL if not absolute
                    this.ad1Image = ad.image.startsWith('http') ? ad.image : `http://localhost:5000${ad.image}`;
                }
            },
            error: (err) => console.error('Failed to load ad1', err)
        });
    }

    prevSlide(): void {
        if (!this.customers.length) return;
        this.currentIndex = (this.currentIndex - 1 + this.customers.length) % this.customers.length;
    }

    nextSlide(): void {
        if (!this.customers.length) return;
        this.currentIndex = (this.currentIndex + 1) % this.customers.length;
    }

    checkScreenSize() {
        this.isSmallScreen = window.innerWidth <= 768;
        this.isMobile = this.isSmallScreen;
    }

    getCategoryImageUrl(imagePath: string): string {
        if (!imagePath) return 'assets/images/default-category.png';
        return `http://localhost:5000${imagePath}`;
    }

    visibleBrands(): Brand[] {
        const start = this.currentPage * this.pageSize;
        return this.brands.slice(start, start + this.pageSize);
    }

    nextBrandPage() {
        if ((this.currentPage + 1) * this.pageSize < this.brands.length) {
            this.currentPage++;
        }
    }

    prevBrandPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
        }
    }

    getBrandImageUrl(imagePath?: string | File) {
        if (!imagePath) return 'assets/images/default-brand.png';

        // If it's a File (not yet uploaded), return a placeholder or use URL.createObjectURL
        if (imagePath instanceof File) {
            return URL.createObjectURL(imagePath); // creates temporary URL
        }

        return imagePath.startsWith('http') ? imagePath : `http://localhost:5000${imagePath}`;
    }

}
