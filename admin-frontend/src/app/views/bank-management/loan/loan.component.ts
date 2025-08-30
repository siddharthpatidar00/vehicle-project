import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { CardBodyComponent, CardHeaderComponent, CardModule, FormModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { Loan, LoanService } from '../../../services/loan.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    CardModule,
    CardHeaderComponent,
    CardBodyComponent,
    AppPaginationComponent,
    FormsModule,
    MatTooltipModule
  ],
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss']
})
export class LoanComponent implements OnInit {

  loans: Loan[] = [];
  searchQuery: string = '';

  // pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // modal
  isModalOpen = false;
  selectedVehicleDetail: string = '';

  constructor(private loanService: LoanService) { }

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans() {
    this.loanService.getAllLoanInquiries().subscribe({
      next: (res: Loan[] | any) => {
        this.loans = Array.isArray(res) ? res : res.data || [];
      },
      error: (err) => {
        console.error('Failed to load loans', err);
        this.loans = [];
      }
    });
  }


  get filteredLoans(): Loan[] {
    if (!this.searchQuery) return this.loans;
    return this.loans.filter(
      (loan) =>
        loan.fullName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        loan.email?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        loan.mobile?.includes(this.searchQuery)
    );
  }

  get paginatedLoan(): (Loan & { serial: number })[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLoans
      .slice(start, start + this.itemsPerPage)
      .map((loan, i) => ({ ...loan, serial: start + i + 1 }));
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLoans.length / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  getShortVehicleDetail(detail?: string): string {
    if (!detail) return '';
    const words = detail.split(' ');
    return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  }

  openModal(detail?: string) {
    this.selectedVehicleDetail = detail || '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedVehicleDetail = '';
  }


}
