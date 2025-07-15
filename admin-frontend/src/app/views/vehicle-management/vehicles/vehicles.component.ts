// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormsModule } from '@angular/forms';
// import { IconModule } from '@coreui/icons-angular';
// import { CardModule, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
// import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
// import { VehicleService, Vehicle } from '../../../services/vehicle.service';
// import { HttpClientModule } from '@angular/common/http';
// import { AuthService } from '../../../services/auth.service';
// import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component"
// import { ToastService } from '../../../services/toast.service';
// import { vehicleSchema } from '../../../schema/vehicle.schema';


// @Component({
//   selector: 'app-vehicles',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     IconModule,
//     CardModule,
//     CardHeaderComponent,
//     CardBodyComponent,
//     AppPaginationComponent,
//     ConfirmModalComponent,
//     HttpClientModule
//   ],
//   templateUrl: './vehicles.component.html',
//   styleUrls: ['./vehicles.component.scss']
// })
// export class VehiclesComponent implements OnInit {

//   vehicleForm! : FormGroup 
//   vehicles: Vehicle[] = [];
//   currentPage = 1;
//   itemsPerPage = 5;
//   showModal = false;
//   editMode = false;
//   selectedImageFile: File | null = null;
//   newVehicle: Partial<Vehicle> = {};
//   showViewModal = false;
//   selectedVehicle: Vehicle | null = null;
//   confirmVisible = false;
//   confirmVehicleId: string | null = null;
//   searchQuery: string = '';
//   vehiclesValidation = vehicleSchema  

//   constructor(
//     private vehicleService: VehicleService,
//     private authService: AuthService,
//     private toast: ToastService
//   ) { }

//   ngOnInit() {
//     this.loadVehicles();
//   }

//   get totalPages() {
//     return Math.ceil(this.filteredVehicles.length / this.itemsPerPage);
//   }


//   onPageChange(page: number) {
//     this.currentPage = page;
//   }

//   loadVehicles() {
//     this.vehicleService.getAll().subscribe(data => {
//       this.vehicles = data;
//     });
//   }

//   openModal() {
//     this.resetForm();
//     this.editMode = false;
//     this.showModal = true;
//   }

//   closeModal() {
//     this.showModal = false;
//   }

//   resetForm() {
//     this.newVehicle = {};
//     this.selectedImageFile = null;
//   }

//   onFileSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     this.selectedImageFile = input.files?.[0] || null;
//   }

//   openViewModal(vehicle: Vehicle) {
//     this.selectedVehicle = vehicle;
//     this.showViewModal = true;
//   }

//   closeViewModal() {
//     this.selectedVehicle = null;
//     this.showViewModal = false;
//   }

//   getFormattedDate(dateString: string | undefined): string {
//     return dateString ? dateString.split('T')[0] : '';
//   }

//   onSubmit() {
//     const formData = new FormData();
//     Object.entries(this.newVehicle).forEach(([key, val]) => {
//       if (val != null) formData.append(key, val as any);
//     });
//     if (this.selectedImageFile) {
//       formData.append('img', this.selectedImageFile);
//     }

//     const userId = this.authService.getUserId();
//     if (userId) {
//       formData.append('created_by', userId);
//     } else {
//       this.toast.error("error", 'User ID not found. Please login again.');
//       return;
//     }

//     if (this.editMode && this.newVehicle._id) {
//       this.vehicleService.update(this.newVehicle._id, this.newVehicle)
//         .subscribe(() => {
//           this.toast.success('success', "Vehicle detail updated successfully")
//           this.closeModal();
//           this.loadVehicles();
//         });
//     } else {
//       this.vehicleService.create(formData)
//         .subscribe(() => {
//           this.toast.success('success', "Vehicle added successfully")
//           this.closeModal();
//           this.loadVehicles();
//         });
//     }
//   }

//   editVehicle(v: Vehicle) {
//     this.newVehicle = { ...v };
//     this.editMode = true;
//     this.showModal = true;
//   }

//   deleteVehicle(vehicle: Vehicle) {
//     this.confirmVehicleId = vehicle._id || null;
//     this.confirmVisible = true;
//   }

//   handleConfirmDelete() {
//     if (this.confirmVehicleId) {
//       this.vehicleService.delete(this.confirmVehicleId).subscribe(() => {
//         this.loadVehicles();
//         this.toast.success('success', "Vehicle deleted successfully")
//         this.confirmVisible = false;
//         this.confirmVehicleId = null;
//       });
//     }
//   }

//   handleCancelDelete() {
//     this.confirmVisible = false;
//     this.confirmVehicleId = null;
//   }

//   getError(field: string) {
//     const ctl = this.vehicleForm.get(field);
//     return ctl?.errors?.['message'] || null;
//   }


//   get paginatedVehicles(): Vehicle[] {
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     return this.filteredVehicles.slice(start, start + this.itemsPerPage);
//   }

// get filteredVehicles() {
//   const query = this.searchQuery.toLowerCase().trim();

//   return this.vehicles.filter((cat, index) =>
//     (cat.name || '').toLowerCase().includes(query) ||
//     (cat.model || '').toLowerCase().includes(query) ||
//     (cat.brand || '').toLowerCase().includes(query) ||
//     (cat.status || '').toLowerCase().includes(query) ||
//     (index + 1).toString().includes(query)
//   );
// }


// }






import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { CardModule, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { VehicleService, Vehicle } from '../../../services/vehicle.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component"
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
  selectedImageFile: File | null = null;
  newVehicle: Partial<Vehicle> = {};
  showViewModal = false;
  selectedVehicle: Vehicle | null = null;
  confirmVisible = false;
  confirmVehicleId: string | null = null;
  searchQuery: string = '';
  submitted = false;
  formErrors: Record<string, string> = {};
  vehiclesValidation = vehicleSchema;

  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
    private toast: ToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadVehicles();
    this.vehicleForm = this.fb.group({
      name: [''],
      model: [''],
      brand: [''],
      km_driven: [''],
      ownership: [''],
      manufacture_year: [''],
      isInsured: [''],
      insuranceValidTill: [''],
      price: [''],
      status: [''],
      sell_or_rent: [''],
      description: ['']
    });
  }

  get totalPages() {
    return Math.ceil(this.filteredVehicles.length / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  loadVehicles() {
    this.vehicleService.getAll().subscribe(data => {
      this.vehicles = data;
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
    this.selectedImageFile = null;
    this.submitted = false;
    this.formErrors = {};
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedImageFile = input.files?.[0] || null;
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
        Object.entries({ ...this.newVehicle, ...formRaw }).forEach(([key, val]) => {
          if (val != null) formData.append(key, val as string | Blob);
        });

        if (this.selectedImageFile) {
          formData.append('img', this.selectedImageFile);
        }

        const userId = this.authService.getUserId();
        if (userId) {
          formData.append('created_by', userId);
        } else {
          this.toast.error("error", 'User ID not found. Please login again.');
          return;
        }

        if (this.editMode && this.newVehicle._id) {
          this.vehicleService.update(this.newVehicle._id, { ...this.newVehicle, ...formRaw })
            .subscribe(() => {
              this.toast.success('success', "Vehicle detail updated successfully");
              this.closeModal();
              this.loadVehicles();
            });
        } else {
          this.vehicleService.create(formData)
            .subscribe(() => {
              this.toast.success('success', "Vehicle added successfully");
              this.closeModal();
              this.loadVehicles();
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
  }

  deleteVehicle(vehicle: Vehicle) {
    this.confirmVehicleId = vehicle._id || null;
    this.confirmVisible = true;
  }

  handleConfirmDelete() {
    if (this.confirmVehicleId) {
      this.vehicleService.delete(this.confirmVehicleId).subscribe(() => {
        this.loadVehicles();
        this.toast.success('success', "Vehicle deleted successfully");
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
}
