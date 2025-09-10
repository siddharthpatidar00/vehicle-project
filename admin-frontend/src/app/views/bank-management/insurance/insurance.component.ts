import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardHeaderComponent, CardModule, FormModule } from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InsuranceService, Insurance } from '../../../services/insurance.service';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    CardModule,
    CardHeaderComponent,
    AppPaginationComponent,
    FormsModule,
    MatTooltipModule
  ],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

  insurance: Insurance[] = [];
  searchQuery: string = '';

  // pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // modal
  isModalOpen = false;
  selectedVehicleDetail: string = '';

  constructor(private insuranceService: InsuranceService) {}

  ngOnInit(): void {
    this.loadInsurance();
  }

  loadInsurance() {
    this.insuranceService.getAllInsurances().subscribe({
      next: (res: Insurance[] | any) => {
        this.insurance = Array.isArray(res) ? res : res.data || [];
      },
      error: (err) => {
        console.error('Failed to load insurances', err);
        this.insurance = [];
      }
    });
  }

  get filteredInsurance(): Insurance[] {
    if (!this.searchQuery) return this.insurance;
    return this.insurance.filter(
      (insurance) =>
        insurance.fullName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        insurance.mobile?.includes(this.searchQuery) ||
        insurance.policyNumber?.toString().includes(this.searchQuery) ||
        insurance.insuranceType?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get paginatedInsurance(): (Insurance & { serial: number })[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredInsurance
      .slice(start, start + this.itemsPerPage)
      .map((insurance, i) => ({ ...insurance, serial: start + i + 1 }));
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInsurance.length / this.itemsPerPage);
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
