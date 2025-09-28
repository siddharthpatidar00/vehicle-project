import { Component, EventEmitter, Output,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleCategoryService } from '../../services/categories.service';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css']
})


export class SearchModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  categories: any[] = [];

  constructor(private vehicleCategoryService: VehicleCategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

loadCategories() {
  this.vehicleCategoryService.getAllCategories().subscribe({
    next: (res) => {
      // Filter categories to only those with status "Active"
      this.categories = res.filter((cat: any) => cat.status === 'Active');
    },
    error: (err) => {
      console.error('Failed to load categories', err);
    }
  });
}


getCategoryImageUrl(imagePath: string): string {
  if (!imagePath) {
    return 'assets/images/default-category.png';  // fallback image
  }
  // imagePath is like "/uploads/filename.jpg" — prepend your backend base URL:
  return `http://localhost:5000${imagePath}`;
}


  closeModal() {
    this.close.emit();
  }
}

