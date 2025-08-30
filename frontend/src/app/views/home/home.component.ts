import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleCategoryService } from '../../shared/services/categories.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgFor, CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    categories: any[] = [];
    images: string[] = [
        'assets/images/truck.jpg',
        'assets/images/1.avif',
        'assets/images/2.avif',
        'assets/images/3.avif',
        'assets/images/4.webp'
    ];
    currentIndex = 0;
    intervalId: any;
    isMobile = false;
    isSmallScreen = false;

    constructor(private vehicleCategoryService: VehicleCategoryService) { }

    ngOnInit(): void {
        this.loadCategories(); // FIX: Call method so categories load

        this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
        }, 5000);

        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize.bind(this));
    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        window.removeEventListener('resize', this.checkScreenSize.bind(this));
    }

    checkScreenSize() {
        this.isSmallScreen = window.innerWidth <= 768;
    }

    nextSlide(): void {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }

    prevSlide(): void {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }

    loadCategories() {
        this.vehicleCategoryService.getAllCategories().subscribe({
            next: (res) => {
                console.log('API categories response:', res);

                let categoryList: any[] = [];
                if (Array.isArray(res)) {
                    categoryList = res;
                } else if (res?.data && Array.isArray(res.data)) {
                    categoryList = res.data;
                }

                this.categories = categoryList.filter(
                    (cat: any) => cat.status?.toLowerCase() === 'active'
                );
            },
            error: (err) => {
                console.error('Failed to load categories', err);
            }
        });
    }

    getCategoryImageUrl(imagePath: string): string {
        if (!imagePath) {
            return 'assets/images/default-category.png';
        }
        return `http://localhost:5000${imagePath}`;
    }

    customers = [
        { name: 'Alice', image: 'assets/images/1.avif', message: 'Amazing service! Very satisfied.' },
        { name: 'Bob', image: 'assets/images/2.avif', message: 'Excellent experience overall!' },
        { name: 'Charlie', image: 'assets/images/3.avif', message: 'Reliable and professional team.' },
        { name: 'David', image: 'assets/images/4.webp', message: 'Loved the fast response!' },
        { name: 'Eva', image: 'assets/images/1.avif', message: 'Truly top-notch customer support.' }
    ];
}
