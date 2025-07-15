import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { PaginationModule } from '@coreui/angular';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgFor, NgClass, PaginationModule],
  templateUrl: './pagination.component.html'
})
export class AppPaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  onPageClick(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
