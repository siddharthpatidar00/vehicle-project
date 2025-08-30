import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PartialVehicleInquiry, VehicleInquiryService } from '../../services/vehicle.inquiry.service';
import { validateYupSchema } from '../../schema/yup.validation';
import { VehicleInquirySchema } from '../../schema/inquiry.validation';
import { ToastService } from '../../../shared/services/toast.service';
import { VehicleCategoryService } from '../../services/categories.service';
import { BrandService, Brand } from '../../services/brand.service';

@Component({
  selector: 'app-inquiry-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './inquiry-modal.component.html',
  styleUrls: ['./inquiry-modal.component.scss']
})
export class InquiryModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  inquiryForm = new FormGroup({
    name: new FormControl(''),
    company: new FormControl(''),
    city: new FormControl(''),
    email: new FormControl(''),
    phone_number: new FormControl(''),
    brand: new FormControl(''),
    category: new FormControl(''),
    vehicle_details: new FormControl(''),
    buy_sell_rent: new FormControl('Buy'),
    enquiry_type: new FormControl('Individual'),
    message: new FormControl('')
  }, { validators: validateYupSchema(VehicleInquirySchema) });

  categories: any[] = [];
  brands: Brand[] = [];
  selectedCategory: string | null = null;
  categoryDropdownOpen = false;
  selectedBrand: string | null = null;
  brandDropdownOpen = false;
  selectedBuySellRent: string | null = null;
  buySellRentDropdownOpen = false;
  selectedEnquiryType: string | null = null;
  enquiryTypeDropdownOpen = false;


  constructor(
    private inquiryService: VehicleInquiryService,
    private toast: ToastService,
    private vehicleCategoryService: VehicleCategoryService,
    private brandService: BrandService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadBrands();
  }
  selectCategory(categoryName: string) {
    this.selectedCategory = categoryName;
    this.inquiryForm.get('category')?.setValue(categoryName);
    this.categoryDropdownOpen = false;
  }
  selectBrand(brandName: string) {
    this.selectedBrand = brandName;
    this.inquiryForm.get('brand')?.setValue(brandName);
    this.brandDropdownOpen = false;
  }
  selectBuySellRent(option: string) {
    this.selectedBuySellRent = option;
    this.inquiryForm.get('buy_sell_rent')?.setValue(option);
    this.buySellRentDropdownOpen = false;
  }
  selectEnquiryType(option: string) {
    this.selectedEnquiryType = option;
    this.inquiryForm.get('enquiry_type')?.setValue(option);
    this.enquiryTypeDropdownOpen = false;
  }
  loadCategories() {
    this.vehicleCategoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.filter((cat: any) => cat.status === 'Active');
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (res) => {
        this.brands = res.filter(b => b.status === 'Active');
      },
      error: (err) => {
        console.error('Failed to load brands', err);
      }
    });
  }

  submitForm() {
    this.inquiryForm.markAllAsTouched();

    if (this.inquiryForm.invalid) return;

    const payload: PartialVehicleInquiry = {
      ...(this.inquiryForm.value as any),
      buy_sell_rent: this.inquiryForm.value.buy_sell_rent as 'Buy' | 'Sell' | 'Rent',
      enquiry_type: this.inquiryForm.value.enquiry_type as 'Individual' | 'Company'
    };

    this.inquiryService.createInquiry(payload).subscribe({
      next: () => {
        this.toast.success('Success', 'Inquiry sent successfully!');
        this.inquiryForm.reset({ buy_sell_rent: 'Buy', enquiry_type: 'Individual' });
        this.closeModal();
      },
      error: () => {
        this.toast.error('Error', 'Failed to send inquiry');
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.inquiryForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getError(field: string): string | null {
    return this.inquiryForm.get(field)?.getError('yup') || null;
  }

  closeModal() {
    this.close.emit();
  }
}
