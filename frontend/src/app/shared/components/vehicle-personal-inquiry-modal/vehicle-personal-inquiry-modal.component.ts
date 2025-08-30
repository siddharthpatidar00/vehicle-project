import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PartialVehicleInquiry, VehicleInquiryService } from '../../services/vehicle.inquiry.service';
import { validateYupSchema } from '../../schema/yup.validation';
import { PersonalVehicleInquirySchema } from '../../schema/personal.inquiry.validation';
import { ToastService } from '../../../shared/services/toast.service';
import { VehicleCategoryService } from '../../services/categories.service';
import { BrandService, Brand } from '../../services/brand.service';
import { VehicleListingService } from '../../services/vehicle.listing.service'

@Component({
  selector: 'app-vehicle-personal-inquiry-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './vehicle-personal-inquiry-modal.component.html',
  styleUrl: './vehicle-personal-inquiry-modal.component.scss'
})
export class VehiclePersonalInquiryModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() vehicleName: string | null = null; 

  vehiclePersonalInquiryForm = new FormGroup({
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
  }, { validators: validateYupSchema(PersonalVehicleInquirySchema) });

  categories: any[] = [];
  brands: Brand[] = [];

  constructor(
    private inquiryService: VehicleInquiryService,
    private toast: ToastService,
    private vehicleCategoryService: VehicleCategoryService,
    private brandService: BrandService,
    private vehicleListingService: VehicleListingService // 👈 added
  ) { }

  // ✅ ngOnInit extended
  ngOnInit() {
    this.loadCategories();
    this.loadBrands();

    if (this.vehicleName) {
      this.loadVehicleData(this.vehicleName);
    }
  }

  // ✅ fetch categories
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

  // ✅ fetch brands
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

  // ✅ fetch vehicle details by name and patch into form
  loadVehicleData(name: string) {
  this.vehicleListingService.getVehicleByName(name).subscribe({
    next: (vehicle) => {
      this.vehiclePersonalInquiryForm.patchValue({
        name: vehicle?.name || '',
        company: '',
        city: '',
        email: '',
        phone_number: '',
        brand: vehicle?.brand || '',
        category: vehicle?.category_name || '',
        vehicle_details: vehicle?.model || '',
        buy_sell_rent: vehicle?.sell_or_rent === 'Rent' ? 'Rent' : 'Buy',
        enquiry_type: 'Individual',
        message: vehicle?.description || ''
      });
    },
    error: (err) => {
      console.error('Failed to load vehicle data', err);
    }
  });
}


  // ✅ existing submit logic
  submitForm() {
    this.vehiclePersonalInquiryForm.markAllAsTouched();

    if (this.vehiclePersonalInquiryForm.invalid) return;

    const payload: PartialVehicleInquiry = {
      ...(this.vehiclePersonalInquiryForm.value as any),
      buy_sell_rent: this.vehiclePersonalInquiryForm.value.buy_sell_rent as 'Buy' | 'Sell' | 'Rent',
      enquiry_type: this.vehiclePersonalInquiryForm.value.enquiry_type as 'Individual' | 'Company'
    };

    this.inquiryService.createInquiry(payload).subscribe({
      next: () => {
        this.toast.success('Success', 'Inquiry sent successfully!');
        this.vehiclePersonalInquiryForm.reset({ buy_sell_rent: 'Buy', enquiry_type: 'Individual' });
        this.closeModal();
      },
      error: () => {
        this.toast.error('Error', 'Failed to send inquiry');
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.vehiclePersonalInquiryForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getError(field: string): string | null {
    return this.vehiclePersonalInquiryForm.get(field)?.getError('yup') || null;
  }

  closeModal() {
    this.close.emit();
  }
}
