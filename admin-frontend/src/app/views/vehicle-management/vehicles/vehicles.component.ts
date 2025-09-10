
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { CardModule, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { VehicleService, Vehicle } from '../../../services/vehicle.service';
import { BrandService, Brand } from '../../../services/brand.service';
import { VehicleCategoryService, VehicleCategory } from '../../../services/vehicle.category.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";
import { ToastService } from '../../../services/toast.service';
import { vehicleSchema } from '../../../schema/vehicle.schema';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    CardModule,
    CardHeaderComponent,
    CardBodyComponent,
    AppPaginationComponent,
    ConfirmModalComponent,
    HttpClientModule
  ],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  vehicleForm!: FormGroup;
  vehicles: Vehicle[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  editMode = false;
  newVehicle: Partial<Vehicle> = {};
  showViewModal = false;
  selectedVehicle: Vehicle | null = null;
  confirmVisible = false;
  confirmVehicleId: string | null = null;
  searchQuery: string = '';
  submitted = false;
  formErrors: Record<string, string> = {};
  vehiclesValidation = vehicleSchema;
  brands: Brand[] = [];
  categories: VehicleCategory[] = [];
  selectedImageFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
    private brandService: BrandService,
    private vehicleCategoryService: VehicleCategoryService,
    private toast: ToastService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadVehicles();
    this.loadBrands();
    this.loadCategories();
    this.vehicleForm = this.fb.group({
      name: [''],
      model: [''],
      brand: [''],
      category: [''],
      km_driven: [''],
      ownership: [''],
      manufacture_year: [''],
      isInsured: [''],
      insuranceValidTill: [''],
      price: [''],
      phone: [''],
      status: [''],
      sell_or_rent: [''],
      description: ['']
    });
  }

  loadVehicles() {
    this.vehicleService.getAll(true).subscribe(data => {
      this.vehicles = data;
    });
  }

  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (data) => {
        this.brands = data.filter(b => b.status === 'Active');
      },
      error: () => {
        this.toast.error("Failed to load brands");
      }
    });
  }

  loadCategories() {
    this.vehicleCategoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data.filter(c => c.status === 'Active');
      },
      error: () => {
        this.toast.error("Failed to load categories");
      }
    });
  }

  openModal() {
    this.resetForm();
    this.editMode = false;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.newVehicle = {};
    this.vehicleForm?.reset();
    this.selectedImageFiles = [];
    this.imagePreviews = [];
    this.submitted = false;
    this.formErrors = {};
  }

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   this.selectedImageFile = input.files?.[0] || null;
  // }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);

      if (files.length + this.selectedImageFiles.length > 5) {
        this.toast.error('You can upload a maximum of 5 images.');
        return;
      }

      files.forEach(file => {
        this.selectedImageFiles.push(file);
        this.imagePreviews.push(URL.createObjectURL(file));
      });
    }
  }

  removeImage(index: number) {
    this.selectedImageFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  openViewModal(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.selectedVehicle = null;
    this.showViewModal = false;
  }

  getFormattedDate(dateString: string | undefined): string {
    return dateString ? dateString.split('T')[0] : '';
  }

  onSubmit() {
    this.submitted = true;
    this.formErrors = {};
    const formRaw = this.vehicleForm.getRawValue();

    this.vehiclesValidation.validate(formRaw, { abortEarly: false })
      .then(() => {
        const formData = new FormData();

        // Append form fields
        Object.entries({ ...this.newVehicle, ...formRaw }).forEach(([key, val]) => {
          if (val != null) {
            formData.append(key, val as string | Blob);
          }
        });
        // Ensure category_name is always a string
        const categoryValue = Array.isArray(formRaw.category) ? formRaw.category[0] : formRaw.category;
        formData.append('category_name', categoryValue || '');

        if (!this.editMode) {
          const userId = this.authService.getUserId();
          if (!userId) {
            this.toast.error('User ID not found. Please login again.');
            return;
          }
          formData.append('created_by', userId);
        }
        // --- Handle Images ---
        if (this.editMode && this.newVehicle._id) {
          // Convert previews back to original paths for backend
          const existingPaths = (this.imagePreviews || [])
            .filter(url => !url.startsWith('blob:')) // ignore new blobs
            .map(url => url.replace('http://localhost:5000', ''));
          formData.append('existingImages', JSON.stringify(existingPaths));
        }

        // Append newly selected files
        if (this.selectedImageFiles.length > 0) {
          this.selectedImageFiles.forEach(file => formData.append('img', file));
        }

        // Call API
        if (this.editMode && this.newVehicle._id) {
          this.vehicleService.update(this.newVehicle._id, formData).subscribe({
            next: () => {
              this.toast.success("Vehicle updated successfully");
              this.closeModal();
              this.loadVehicles();
            },
            error: (err) => {
              console.error("Update error:", err);
              this.toast.error("Failed to update vehicle");
            }
          });
        } else {
          this.vehicleService.create(formData).subscribe({
            next: () => {
              this.toast.success( "Vehicle added successfully");
              this.closeModal();
              this.loadVehicles();
            },
            error: (err) => {
              console.error("Create error:", err);
              this.toast.error("Failed to create vehicle");
            }
          });
        }
      })
      .catch((err) => {
        if (err.inner && Array.isArray(err.inner)) {
          for (const error of err.inner) {
            this.formErrors[error.path] = error.message;
            this.vehicleForm.get(error.path)?.setErrors({ message: error.message });
          }
        }
      });
  }


  editVehicle(v: Vehicle) {
    this.newVehicle = { ...v };
    this.editMode = true;
    this.showModal = true;
    this.vehicleForm.patchValue({
      name: v.name,
      model: v.model,
      brand: v.brand,
      category: v.category_name,
      km_driven: v.km_driven,
      ownership: v.ownership,
      manufacture_year: v.manufacture_year,
      isInsured: v.isInsured,
      insuranceValidTill: v.insuranceValidTill,
      price: v.price,
      status: v.status,
      sell_or_rent: v.sell_or_rent,
      description: v.description,
    });

    // Show existing images as previews
    this.imagePreviews = (v.img || []).map(img =>
      img.startsWith('http') ? img : `http://localhost:5000${img}`
    );

    // Keep selectedImageFiles empty initially, will append new files if user selects
    this.selectedImageFiles = [];
  }


  deleteVehicle(vehicle: Vehicle) {
    this.confirmVehicleId = vehicle._id || null;
    this.confirmVisible = true;
  }

  handleConfirmDelete() {
    if (this.confirmVehicleId) {
      this.vehicleService.delete(this.confirmVehicleId).subscribe(() => {
        this.loadVehicles();
        this.toast.success("Vehicle deleted successfully");
        this.confirmVisible = false;
        this.confirmVehicleId = null;
      });
    }
  }

  handleCancelDelete() {
    this.confirmVisible = false;
    this.confirmVehicleId = null;
  }

  getError(field: string) {
    const ctl = this.vehicleForm.get(field);
    return ctl?.errors?.['message'] || null;
  }

  get paginatedVehicles(): Vehicle[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredVehicles.slice(start, start + this.itemsPerPage);
  }

  get filteredVehicles() {
    const query = this.searchQuery.toLowerCase().trim();
    return this.vehicles.filter((cat, index) =>
      (cat.name || '').toLowerCase().includes(query) ||
      (cat.model || '').toLowerCase().includes(query) ||
      (cat.brand || '').toLowerCase().includes(query) ||
      (cat.status || '').toLowerCase().includes(query) ||
      (index + 1).toString().includes(query)
    );
  }

  get totalPages() {
    return Math.ceil(this.filteredVehicles.length / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
