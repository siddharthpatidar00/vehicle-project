import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrandService, Brand } from '../../../../services/brand.service';
import { brandSchema } from '../../../../schema/brand.schema';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    IconModule,
    ButtonModule,
    AppPaginationComponent,
    FormsModule,
    ReactiveFormsModule,
    ConfirmModalComponent
  ],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
})
export class BrandComponent implements OnInit {
  brandForm!: FormGroup;
  brands: Brand[] = [];
  currentPage = 1;
  itemsPerPage = 6;

  showModal = false;
  editMode = false;
  confirmVisible = false;
  confirmBrandId: string | null = null;
  selectedId: string | null = null;
  imagePreview: string | null = null;

  formErrors: Record<string, string> = {};
  submitted = false;

  searchQuery: string = '';

  newBrand: Partial<Brand> = {
    brand_name: '',
    brand_description: '',
    status: 'Active',
    brand_image: '',
  };

  brand = brandSchema;

  constructor(
    private brandService: BrandService,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loadBrands();

    this.brandForm = this.fb.group({
      brand_name: [''],
      brand_description: [''],
      brand_image: ['']
    });
  }

  get totalPages() {
    return Math.ceil(this.filteredBrands.length / this.itemsPerPage);
  }

  get paginatedBrands() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBrands.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (data) => this.brands = data,
      error: (err) => this.toast.error(err.error?.message || 'Failed to load brands')
    });
  }

  openModal() {
    this.resetForm();
    this.editMode = false;
    this.showModal = true;
  }

  editBrand(brand: Brand) {
    this.editMode = true;
    this.selectedId = brand._id || null;
    this.newBrand = { ...brand };
    this.showModal = true;

    this.brandForm.patchValue({
      brand_name: brand.brand_name,
      brand_description: brand.brand_description,
    });
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  onSubmit() {
    this.submitted = true;
    this.formErrors = {};

    // const dataToValidate = this.brandForm.getRawValue();
    const dataToValidate = {
      ...this.brandForm.getRawValue(),
      category_image: this.newBrand.brand_image,
    };

    this.brand
      .validate(dataToValidate, { abortEarly: false })
      .then(() => {
        const payload: Partial<Brand> = {
          ...this.newBrand,
          ...dataToValidate,
        };

        if (this.editMode && this.selectedId) {
          this.brandService.update(this.selectedId, payload as Brand).subscribe({
            next: (res: any) => {
              this.afterSubmit();
              this.toast.success(res.message);
            },
            error: (err) => this.toast.error(err.error?.message || 'Failed to update brand')
          });
        } else {
          this.brandService.create(payload as Brand).subscribe({
            next: (res: any) => {
              this.afterSubmit();
              this.toast.success(res.message);
            },
            error: (err) => this.toast.error(err.error?.message || 'Failed to add brand')
          });
        }
      })
      .catch((err) => {
        if (err.inner && Array.isArray(err.inner)) {
          for (const error of err.inner) {
            this.formErrors[error.path] = error.message;
            this.brandForm.get(error.path)?.setErrors({ message: error.message });
          }
          // this.toast.error(err.inner[0].message);
        }
      });
  }

  afterSubmit() {
    this.loadBrands();
    this.closeModal();
  }

  deleteBrand(id: string) {
    this.confirmBrandId = id;
    this.confirmVisible = true;
  }

  handleConfirmDelete() {
    if (this.confirmBrandId) {
      this.brandService.delete(this.confirmBrandId).subscribe({
        next: (res: any) => {
          this.loadBrands();
          this.toast.success(res.message);
          this.confirmVisible = false;
          this.confirmBrandId = null;
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to delete brand')
      });
    }
  }

  handleCancelDelete() {
    this.confirmVisible = false;
    this.confirmBrandId = null;
  }

  toggleStatus(brand: Brand) {
    if (!brand._id) return;
    const newStatus = brand.status === 'Active' ? 'Inactive' : 'Active';
    this.brandService.toggleStatus(brand._id, newStatus).subscribe({
      next: (res: any) => {
        this.loadBrands();
        this.toast.success(res.message);
      },
      error: (err) => this.toast.error(err.error?.message || 'Failed to toggle status'),
    });
  }

  resetForm() {
    this.newBrand = {
      brand_name: '',
      brand_description: '',
      status: 'Active',
      brand_image: '',
    };
    this.formErrors = {};
    this.submitted = false;
    this.imagePreview = null;
    this.brandForm?.reset();
  }

  getError(field: string) {
    const ctl = this.brandForm.get(field);
    return ctl?.errors?.['message'] || null;
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.newBrand.brand_image = file;
      this.brandForm.patchValue({ brand_image: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  get filteredBrands() {
    const query = this.searchQuery.toLowerCase().trim();

    return this.brands.filter((cat, index) =>
      (cat.brand_name || '').toLowerCase().includes(query) ||
      (cat.brand_description || '').toLowerCase().includes(query) ||
      (cat.status || '').toLowerCase().includes(query) ||
      (index + 1).toString().includes(query)
    );
  }
}
