import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { CardModule, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { VehicleService, Vehicle } from '../../../services/vehicle.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import {ConfirmModalComponent} from "../../shared/confirm-modal/confirm-modal.component"
import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loadVehicles();
  }

  get totalPages() {
    return Math.ceil(this.vehicles.length / this.itemsPerPage);
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
  }

  resetForm() {
    this.newVehicle = {};
    this.selectedImageFile = null;
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
    const formData = new FormData();
    Object.entries(this.newVehicle).forEach(([key, val]) => {
      if (val != null) formData.append(key, val as any);
    });
    if (this.selectedImageFile) {
      formData.append('img', this.selectedImageFile);
    }

    const userId = this.authService.getUserId();
    if (userId) {
      formData.append('created_by', userId);
    } else {
      this.toast.error("error",'User ID not found. Please login again.');
      return;
    }

    if (this.editMode && this.newVehicle._id) {
      this.vehicleService.update(this.newVehicle._id, this.newVehicle)
        .subscribe(() => {
          this.toast.success('success',"Vehicle detail updated successfully")
          this.closeModal();
          this.loadVehicles();
        });
    } else {
      this.vehicleService.create(formData)
        .subscribe(() => {
          this.toast.success('success',"Vehicle added successfully")
          this.closeModal();
          this.loadVehicles();
        });
    }
  }

  editVehicle(v: Vehicle) {
    this.newVehicle = { ...v };
    this.editMode = true;
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
        this.toast.success('success',"Vehicle deleted successfully")
        this.confirmVisible = false;
        this.confirmVehicleId = null;
      });
    }
  }

  handleCancelDelete() {
    this.confirmVisible = false;
    this.confirmVehicleId = null;
  }


  get paginatedVehicles(): Vehicle[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.vehicles.slice(start, start + this.itemsPerPage);
  }

}
