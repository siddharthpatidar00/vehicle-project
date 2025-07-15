import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgFor,CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    images: string[] = [
        'assets/images/truck.jpg',
        'assets/images/1.avif',
        'assets/images/2.avif',
        'assets/images/3.avif',
        'assets/images/4.webp',
    ];

    currentIndex: number = 0;
    intervalId: any;
    isMobile = false;

    ngOnInit(): void {
        this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
        }, 7000);

        this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.customers.length;
        }, 3000);

        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize.bind(this));
    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.intervalId) clearInterval(this.intervalId);
    }

    nextSlide(): void {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }

    prevSlide(): void {
        this.currentIndex =
            (this.currentIndex - 1 + this.images.length) % this.images.length;
    }

    checkScreenSize() {
        this.isMobile = window.innerWidth < 768;
    }

    customers = [
        {
            name: 'Alice',
            image: 'assets/images/1.avif',
            message: 'Amazing service! Very satisfied.'
        },
        {
            name: 'Bob',
            image: 'assets/images/2.avif',
            message: 'Excellent experience overall!'
        },
        {
            name: 'Charlie',
            image: 'assets/images/3.avif',
            message: 'Reliable and professional team.'
        },
        {
            name: 'David',
            image: 'assets/images/4.webp',
            message: 'Loved the fast response!'
        },
        {
            name: 'Eva',
            image: 'assets/images/1.avif',
            message: 'Truly top-notch customer support.'
        }
    ];

}
