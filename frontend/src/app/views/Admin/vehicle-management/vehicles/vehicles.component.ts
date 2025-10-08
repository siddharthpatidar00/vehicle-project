import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { CardModule, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { VehicleService, Vehicle } from '../../../../services/vehicle.service';
import { BrandService, Brand } from '../../../../services/brand.service';
import { VehicleCategoryService, VehicleCategory } from '../../../../services/vehicle.category.service';
import { HttpClientModule } from '@angular/common/http';
import { AdminAuthService } from '../../../../services/auth.service';
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";
import { ToastService } from '../../../../services/toast.service';
import { vehicleSchema } from '../../../../schema/vehicle.schema';
import { forkJoin } from 'rxjs';

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
  loading = false;

  constructor(
    private vehicleService: VehicleService,
    private authService: AdminAuthService,
    private brandService: BrandService,
    private vehicleCategoryService: VehicleCategoryService,
    private toast: ToastService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();

    // Load brands & categories once in parallel
    forkJoin({
      brands: this.brandService.getAll(),
      categories: this.vehicleCategoryService.getAll()
    }).subscribe({
      next: ({ brands, categories }) => {
        this.brands = brands.filter(b => b.status === 'Active');
        this.categories = categories.filter(c => c.status === 'Active');
      },
      error: () => {
        this.toast.error("Failed to load brands or categories");
      }
    });

    // Load vehicles separately
    this.loadVehicles();
  }

  initForm() {
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
      description: [''],
      img: ['']
    });
  }

  loadVehicles() {
    this.loading = true;
    this.vehicleService.getAll(true).subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: () => {
        this.toast.error("Failed to load vehicles");
        this.loading = false;
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
    const schema = vehicleSchema(this.editMode);

    schema.validate(formRaw, { abortEarly: false })
      .then(() => {
        const formData = new FormData();
        Object.entries({ ...this.newVehicle, ...formRaw }).forEach(([key, val]) => {
          if (val != null) {
            formData.append(key, val as string | Blob);
          }
        });

        const categoryValue = Array.isArray(formRaw.category) ? formRaw.category[0] : formRaw.category;
        formData.append('category_name', categoryValue || '');

        if (!this.editMode) {
          const userId = this.authService.getAdminId();
          if (!userId) {
            this.toast.error('User ID not found. Please login again.');
            return;
          }
          formData.append('created_by', userId);
        }

        if (this.editMode && this.newVehicle._id) {
          const existingPaths = (this.imagePreviews || [])
            .filter(url => !url.startsWith('blob:'))
            .map(url => url.replace('http://localhost:5000', ''));
          formData.append('existingImages', JSON.stringify(existingPaths));
        }

        if (this.selectedImageFiles.length > 0) {
          this.selectedImageFiles.forEach(file => formData.append('img', file));
        }

        if (this.editMode && this.newVehicle._id) {
          this.vehicleService.update(this.newVehicle._id, formData).subscribe({
            next: () => {
              this.toast.success("Vehicle updated successfully");
              this.closeModal();
              this.loadVehicles();
            },
            error: (err: any) => {
              console.error("Update error:", err);
              this.toast.error("Failed to update vehicle");
            }
          });
        } else {
          this.vehicleService.create(formData).subscribe({
            next: () => {
              this.toast.success("Vehicle added successfully");
              this.closeModal();
              this.loadVehicles();
            },
            error: (err: any) => {
              console.error("Create error:", err);
              this.toast.error("Failed to create vehicle");
            }
          });
        }
      })
      .catch((err: any) => {
        if (err.inner && Array.isArray(err.inner)) {
          for (const error of err.inner) {
            this.formErrors[error.path] = error.message;
            this.vehicleForm.get(error.path)?.setErrors({ message: error.message });
          }
        }
      });
  }

  editVehicle(vehicle: Vehicle) {
    this.resetForm();
    this.newVehicle = { ...vehicle };
    this.editMode = true;

    // Patch basic data first for faster modal open
    this.vehicleForm.patchValue({
      name: vehicle.name,
      model: vehicle.model,
      brand: vehicle.brand,
      category: vehicle.category_name,
      km_driven: vehicle.km_driven,
      ownership: vehicle.ownership,
      manufacture_year: vehicle.manufacture_year,
      isInsured: vehicle.isInsured,
      insuranceValidTill: vehicle.insuranceValidTill,
      price: vehicle.price,
      status: vehicle.status,
      sell_or_rent: vehicle.sell_or_rent,
      description: vehicle.description
    });

    // Load images after modal open
    setTimeout(() => {
      this.imagePreviews = (vehicle.img || []).map(img =>
        img.startsWith('http') ? img : `http://localhost:5000${img}`
      );
    }, 100);

    this.selectedImageFiles = [];
    this.showModal = true;
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
