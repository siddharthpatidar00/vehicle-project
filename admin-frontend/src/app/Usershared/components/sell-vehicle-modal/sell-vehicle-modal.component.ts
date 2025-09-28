import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SellVehicleService } from '../../services/vehicle.sells.service';
import { ToastService } from '../../services/toast.service';
import { VehicleCategoryService } from '../../services/categories.service';
import { BrandService, Brand } from '../../services/brand.service';
import { SellVehicleSchema } from '../../schema/sell.vehicle.validation';
import { validateYupSchema } from '../../schema/yup.validation';

@Component({
  selector: 'app-sell-vehicle-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sell-vehicle-modal.component.html',
  styleUrls: ['./sell-vehicle-modal.component.scss']
})
export class SellVehicleModalComponent {
  @Output() close = new EventEmitter<void>();
  vehicleForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  categories: any[] = [];
  brands: Brand[] = [];
  selectedImages: File[] = [];
  imagePreviews: string[] = [];
  brandDropdownOpen = false;
  selectedBrand: string | null = null;
  categoryDropdownOpen = false;
  selectedCategory: string | null = null;
  ownershipDropdownOpen = false;
  insuredDropdownOpen = false;
  sellDropdownOpen = false;
  selectedOwnership: string | null = null;
  selectedInsured: boolean | null = null;
  selectedSell: string | null = null;
  ownershipOptions = ['First', 'Second', 'Third', 'Fourth+'];
  constructor(
    private vehicleService: SellVehicleService,
    private toast: ToastService,
    private vehicleCategoryService: VehicleCategoryService,
    private brandService: BrandService
  ) {
    this.vehicleForm = new FormGroup(
      {
        name: new FormControl(''),
        model: new FormControl(''),
        brand: new FormControl(''),
        category: new FormControl(''),
        km_driven: new FormControl(''),
        ownership: new FormControl(null),
        manufacture_year: new FormControl(''),
        price: new FormControl(''),
        isInsured: new FormControl(false),
        insuranceValidTill: new FormControl(''),
        sell_or_rent: new FormControl(null),
        phone: new FormControl(''),
        status: new FormControl('Inactive'),
        img: new FormControl(null),
        description: new FormControl('')
      },
      { validators: validateYupSchema(SellVehicleSchema) }
    );


  }

  ngOnInit() {
    this.loadCategories();
    this.loadBrands();
  }

  closeModal() {
    this.close.emit();
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files);

      // Merge existing + new files
      const totalFiles = [...this.selectedImages, ...newFiles];

      if (totalFiles.length > 5) {
        this.toast.warn('Limit Exceeded', 'You can upload a maximum of 5 images.');
        return;
      }

      this.selectedImages = totalFiles;
      this.vehicleForm.patchValue({ img: this.selectedImages });
      this.vehicleForm.get('img')?.updateValueAndValidity();

      // Clear previews then regenerate
      this.imagePreviews = [];
      this.selectedImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  selectBrand(name: string) {
    this.selectedBrand = name;
    this.vehicleForm.patchValue({ brand: name });
    this.brandDropdownOpen = false;
  }

  selectCategory(name: string) {
    this.selectedCategory = name;
    this.vehicleForm.patchValue({ category: name });
    this.categoryDropdownOpen = false;
  }

  selectOwnership(option: string) {
    this.selectedOwnership = option;
    this.vehicleForm.patchValue({ ownership: option });
    this.ownershipDropdownOpen = false;
  }

  selectInsured(value: boolean) {
    this.selectedInsured = value;
    this.vehicleForm.patchValue({ isInsured: value });
    this.insuredDropdownOpen = false;
  }

  selectSell(value: string) {
    this.selectedSell = value;
    this.vehicleForm.patchValue({ sell_or_rent: value });
    this.sellDropdownOpen = false;
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);

    if (this.selectedImages.length === 0) {
      this.vehicleForm.patchValue({ img: null });
    } else {
      this.vehicleForm.patchValue({ img: this.selectedImages });
    }
  }

  onSubmit() {
    this.vehicleForm.markAllAsTouched();

    // Stop submission if form is invalid
    if (this.vehicleForm.invalid) {
      this.toast.warn('Validation Error', 'Please fill all required fields correctly.');
      return;
    }

    const formData = new FormData();
    Object.keys(this.vehicleForm.controls).forEach((key) => {
      if (key === 'img') {
        if (this.selectedImages.length > 0) {
          this.selectedImages.forEach((file) => {
            formData.append('img', file);
          });
        }
      } else {
        const value = this.vehicleForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    });

    this.vehicleService.createVehicle(formData).subscribe({
      next: () => {
        this.toast.success(
          'Success',
          'Your vehicle details have been submitted successfully. Once approved by our team, it will be listed for sale'
        );
        this.vehicleForm.reset({ status: 'Inactive', isInsured: false });
        this.selectedImages = [];
        this.imagePreviews = [];
        this.closeModal();
      },
      error: () => {
        this.toast.error('Error', 'Failed to submit vehicle');
      }
    });
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
        this.brands = res.filter((b) => b.status === 'Active');
      },
      error: (err) => {
        console.error('Failed to load brands', err);
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.vehicleForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getError(field: string): string | null {
    return this.vehicleForm.get(field)?.getError('yup') || null;
  }

}
