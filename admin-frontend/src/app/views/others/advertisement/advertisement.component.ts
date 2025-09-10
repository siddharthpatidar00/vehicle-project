import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardHeaderComponent, CardModule, FormModule } from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconModule } from '@coreui/icons-angular';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { AdvertisementService, Advertisement } from '../../../services/advertisement.service';
import { ToastService } from '../../../services/toast.service';
import { advertisementSchema } from "../../../schema/advertisement.schema";
import * as yup from 'yup';

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    CardModule,
    CardHeaderComponent,
    AppPaginationComponent,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    IconModule,
    ConfirmModalComponent
  ],
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent implements OnInit {

  ads: Advertisement[] = [];
  filteredAds: Advertisement[] = [];
  paginatedAds: Advertisement[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  showModal = false;
  editMode = false;
  selectedAd: Advertisement | null = null;

  imageFile: File | null = null;
  imagePreview: string | null = null;
  searchText = '';
  adTypes: string[] = ['ad1', 'ad2', 'ad3'];

  advertisementForm!: FormGroup;
  formErrors: Record<string, string> = {};

  selectedAdIdToDelete: string | null = null;

  constructor(private fb: FormBuilder,
              private adService: AdvertisementService,
              private toast: ToastService) { }

  ngOnInit() {
    this.getAllAds();
    this.advertisementForm = this.fb.group({
      type: [''],
      imageTitle: [''],
      startDate: [''],
      endDate: [''],
      image: [null]
    });
  }

  getAllAds() {
    this.adService.getAllAds().subscribe({
      next: ads => {
        this.ads = ads;
        this.filterAds();
      },
      error: err => console.error(err)
    });
  }

  filterAds() {
    const text = this.searchText.toLowerCase();
    this.filteredAds = this.ads.filter(ad =>
      (ad.type && ad.type.toLowerCase().includes(text)) ||
      (ad.imageTitle && ad.imageTitle.toLowerCase().includes(text)) ||
      (ad.startDate && new Date(ad.startDate).toLocaleDateString().includes(text)) ||
      (ad.endDate && new Date(ad.endDate).toLocaleDateString().includes(text)) ||
      (ad.isActive !== undefined && (ad.isActive ? 'active' : 'inactive').includes(text))
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedAds = this.filteredAds.slice(start, start + this.itemsPerPage);
    this.totalPages = Math.ceil(this.filteredAds.length / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  openAddModal() {
    this.resetForm();
    this.editMode = false;
    this.showModal = true;
  }

  openEditModal(ad: Advertisement) {
    this.resetForm();
    this.editMode = true;
    this.showModal = true;
    this.selectedAd = ad;

    this.advertisementForm.patchValue({
      type: ad.type,
      imageTitle: ad.imageTitle,
      startDate: this.formatDateForInput(ad.startDate),
      endDate: this.formatDateForInput(ad.endDate),
      image: null
    });

    this.imagePreview = ad.image ? this.getAdImageUrl(ad.image) : null;
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.advertisementForm.reset();
    this.formErrors = {};
    this.imageFile = null;
    this.imagePreview = null;
    this.selectedAd = null;
  }

  onImageSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      this.advertisementForm.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  getAdImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `http://localhost:8000/${imagePath}`;
  }

  onSubmit() {
    this.formErrors = {};

    const payload = { ...this.advertisementForm.value, image: this.imageFile };

    advertisementSchema(this.editMode).validate(payload, { abortEarly: false })
      .then(() => {
        const formData = new FormData();
        formData.append('type', payload.type);
        formData.append('imageTitle', payload.imageTitle);
        formData.append('startDate', payload.startDate);
        formData.append('endDate', payload.endDate);
        if (this.imageFile) formData.append('image', this.imageFile);

        if (this.editMode && this.selectedAd) {
          this.adService.updateAd(this.selectedAd._id, formData).subscribe({
            next: () => this.afterSubmit('Advertisement updated successfully'),
            error: () => this.toast.error('Failed to update advertisement')
          });
        } else {
          this.adService.createAd(formData).subscribe({
            next: () => this.afterSubmit('Advertisement added successfully'),
            error: () => this.toast.error('Failed to add advertisement')
          });
        }
      })
      .catch(err => {
        if (err.inner && Array.isArray(err.inner)) {
          err.inner.forEach((error: any) => {
            this.formErrors[error.path] = error.message;
            this.advertisementForm.get(error.path)?.setErrors({ message: error.message });
          });
        }
      });
  }

  afterSubmit(msg: string) {
    this.getAllAds();
    this.closeModal();
    this.toast.success(msg);
  }

  openDeleteModal(ad: Advertisement) {
    this.selectedAdIdToDelete = ad._id!;
  }

  handleConfirmDelete() {
    if (!this.selectedAdIdToDelete) return;
    this.adService.deleteAd(this.selectedAdIdToDelete).subscribe({
      next: () => {
        this.getAllAds();
        this.toast.success('Advertisement deleted successfully');
        this.selectedAdIdToDelete = null;
      },
      error: () => this.toast.error('Failed to delete advertisement')
    });
  }

  handleCancelDelete() {
    this.selectedAdIdToDelete = null;
  }

  getError(field: string) {
    const ctl = this.advertisementForm.get(field);
    return ctl?.errors?.['message'] || null;
  }
}
