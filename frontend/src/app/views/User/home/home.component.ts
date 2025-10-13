import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Pipe, PipeTransform } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleCategoryService } from '../../../services/vehicle.category.service';
import { HappyCustomerService, HappyCustomer } from '../../../services/happy.customer.service';
import { BrandService, Brand } from '../../../services/brand.service';
import { AdvertisementService } from '../../../services/advertisement.service';

@Pipe({ name: 'splitAfterWords' })
export class SplitAfterWordsPipe implements PipeTransform {
    transform(value: string, wordsCount: number = 5): string {
        if (!value) return '';
        const words = value.split(' ');
        if (words.length <= wordsCount) return value;
        const firstLine = words.slice(0, wordsCount).join(' ');
        const secondLine = words.slice(wordsCount).join(' ');
        return firstLine + '<br>' + secondLine;
    }
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgFor, CommonModule, RouterLink, SplitAfterWordsPipe],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    @ViewChild('customerWrapper') customerWrapper!: ElementRef<HTMLDivElement>;
    @ViewChild('brandWrapper') brandWrapper!: ElementRef<HTMLDivElement>;
    @ViewChild('categoryWrapper') categoryWrapper!: ElementRef<HTMLDivElement>;

    categories: any[] = [];
    customers: HappyCustomer[] = [];
    brands: Brand[] = [];
    ad1Image = '';
    ad1Status = 'inactive';
    images: string[] = [
        'assets/images/truck.jpg',
        'assets/images/1.avif',
        'assets/images/login.jpg',
        'assets/images/3.avif',
        'assets/images/4.webp'
    ];

    // Customer slider
    currentIndex = 0;
    cardWidth = 336 + 16;

    // Brand slider
    currentBrandIndex = 0;
    brandCardWidth = 336 + 24;

    // Category slider
    currentCategoryIndex = 0;
    categoryCardWidth = 336 + 24;

    isMobile = false;


    private imageSliderInterval: any

    constructor(
        private vehicleCategoryService: VehicleCategoryService,
        private customerService: HappyCustomerService,
        private brandService: BrandService,
        private advertisementService: AdvertisementService,
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        this.loadCustomers();
        this.loadBrands();
        this.loadAd1();
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize.bind(this));
        this.imageSliderInterval = setInterval(() => {
            this.nextImageSlide();
        }, 5000);
    }


    ngAfterViewInit(): void {
        // Calculate dynamic width of category card + gap
        const firstCategoryCard = this.categoryWrapper?.nativeElement.querySelector('div.flex-none');
        if (firstCategoryCard) {
            this.categoryCardWidth = firstCategoryCard.clientWidth + 24; // 24 = gap-6
        }
    }


    ngOnDestroy(): void {
        window.removeEventListener('resize', this.checkScreenSize.bind(this));
        if (this.imageSliderInterval) {
            clearInterval(this.imageSliderInterval);
        }
    }

    // --- Data Loaders ---
    loadCategories(): void {
        this.vehicleCategoryService.getAllCategories().subscribe({
            next: res => {
                const categoryList = Array.isArray(res) ? res : res?.data || [];
                this.categories = categoryList.filter((c: any) => c.status?.toLowerCase() === 'active');
            },
            error: err => console.error('Failed to load categories', err)
        });
    }

    loadCustomers(): void {
        this.customerService.getAllCustomers().subscribe({
            next: res => {
                this.customers = res.map(c => ({
                    ...c,
                    image: c.image.startsWith('http') ? c.image : `http://localhost:5000${c.image}`
                }));
            },
            error: err => console.error('Failed to load customers', err)
        });
    }

    loadBrands(): void {
        this.brandService.getAll().subscribe({
            next: res => this.brands = res.filter(b => b.status?.toLowerCase() === 'active'),
            error: err => console.error('Failed to load brands', err)
        });
    }

    // loadAd1(): void {
    //     this.advertisementService.getAdByType('ad1').subscribe({
    //         next: ad => this.ad1Image = ad?.image?.startsWith('http') ? ad.image : `http://localhost:5000${ad?.image || ''}`,
    //         error: err => console.error('Failed to load ad1', err)
    //     });
    // }
    loadAd1(): void {
        this.advertisementService.getAdByType('ad1').subscribe({
            next: ad => {
                if (ad && ad.isActive) {   // check isActive instead of status
                    this.ad1Image = ad.image?.startsWith('http') ? ad.image : `http://localhost:5000${ad.image}`;
                } else {
                    this.ad1Image = ''; // hide container if inactive
                }
            },
            error: err => console.error('Failed to load ad1', err)
        });
    }

    // --- Customer slider ---
    prevSlide(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.scrollCustomerCards();
        }
    }

    nextSlide(): void {
        if (this.currentIndex < this.customers.length - 1) {
            this.currentIndex++;
            this.scrollCustomerCards();
        }
    }

    scrollCustomerCards(): void {
        if (!this.customerWrapper) return;
        this.customerWrapper.nativeElement.scrollTo({
            left: this.currentIndex * this.cardWidth,
            behavior: 'smooth'
        });
    }

    // --- Brand slider ---
    prevBrand(): void {
        if (this.currentBrandIndex > 0) {
            this.currentBrandIndex--;
            this.scrollBrandCards();
        }
    }

    nextBrand(): void {
        if (this.currentBrandIndex < this.brands.length - 1) {
            this.currentBrandIndex++;
            this.scrollBrandCards();
        }
    }

    scrollBrandCards(): void {
        if (!this.brandWrapper) return;
        this.brandWrapper.nativeElement.scrollTo({
            left: this.currentBrandIndex * this.brandCardWidth,
            behavior: 'smooth'
        });
    }

    // --- Category slider ---
    prevCategory(): void {
        if (this.currentCategoryIndex > 0) {
            this.currentCategoryIndex--;
            this.scrollCategoryCards();
        }
    }

    nextCategory(): void {
        if (this.currentCategoryIndex < this.categories.length - 1) {
            this.currentCategoryIndex++;
            this.scrollCategoryCards();
        }
    }

    scrollCategoryCards(): void {
        if (!this.categoryWrapper) return;
        this.categoryWrapper.nativeElement.scrollTo({
            left: this.currentCategoryIndex * this.categoryCardWidth,
            behavior: 'smooth'
        });
    }

    // --- Screen size ---
    checkScreenSize(): void {
        this.isMobile = window.innerWidth <= 768;
        this.cardWidth = this.isMobile ? 250 + 16 : 336 + 16;
        this.brandCardWidth = this.isMobile ? 250 + 16 : 336 + 24;
    }

    // --- Image URLs ---
    getCategoryImageUrl(path: string): string {
        return path ? `http://localhost:5000${path}` : '';
    }

    getBrandImageUrl(path?: string | File): string {
        if (!path) return '';
        return path instanceof File ? URL.createObjectURL(path) :
            path.startsWith('http') ? path : `http://localhost:5000${path}`;
    }

    // --- Image slider ---
    prevImageSlide(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.images.length - 1; // loop back to last
        }
    }

    nextImageSlide(): void {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // loop back to first
        }
    }

}
